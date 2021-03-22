import * as venom from 'venom-bot';
import axios from 'axios';
import { resolve } from 'path';

import { ClientRepository } from '../repositories';
import { SendMailService } from './SendMailService';
import { HtmlService } from './HtmlService';
import { AppError } from '../errors';
import { messageTextInterface } from '../interfaces';

const clientRepository = new ClientRepository();
const sendMailService = new SendMailService();
const htmlService = new HtmlService();

const globalClients = {};
const numberComplement = '@c.us';

class BotService {
  async startAllBots() {
    const clients = await clientRepository.indexActives();

    await Promise.all(
      clients.map((item) => venom
        .create(
          `bot_${item.number}`,
          (base64Qrimg, asciiQR, attempts, urlCode) => {
            console.log('base64 image string qrcode: ', base64Qrimg);
            // console.log('Number of attempts to read the qrcode: ', attempts);
            // console.log('Terminal qrcode: ', asciiQR);
            // console.log('urlCode (data-ref): ', urlCode);

            // const htmlTemplate = resolve(__dirname, '..', 'views', 'html', 'qrcodeScan.hbs');
            // const html = htmlService.create(
            //   htmlTemplate,
            //   {
            //     client_name: item.name,
            //     client_number: item.number,
            //     qrcode: base64Qrimg,
            //   },
            // );

            // sendMailService.sendMail({
            //   to: 'welingtonfidelis@gmail.com',
            //   subject: 'teste',
            //   message: html,
            // });
          },
          null,
          { puppeteerOptions: { args: ['--no-sandbox'] } },
        )
        .then(async (client) => {
          const clientNumber = `${item.number}${numberComplement}`;

          globalClients[clientNumber] = {
            ...item,
            venomClient: client,
          };

          this.startBot(item.number);
        })
        .catch((error) => console.log(error))),
    );
  }

  startBot(clientNumber: string) {
    const client = globalClients[`${clientNumber}${numberComplement}`];

    if (!client) {
      throw new AppError('Client do not exists or is not active.');
    }

    const { venomClient } = client;

    venomClient.onMessage(async (message) => {
      const {
        from, to, sender, type, body, t,
      } = message;
      const { name } = sender;

      try {
        const { endPoint } = globalClients[to];
        await axios.post(
          endPoint,
          {
            from: (from.split('@'))[0],
            timestamp: (t * 1000),
            message: body,
          },
        );
      } catch (error) {
        console.log(error);

        const msg = `Error during sending message. ${from} -> ${to}`;

        venomClient.sendText(from, msg);

        throw new AppError(error.message || msg, error.code || 500);
      }
    });
  }

  sendTextMessage(message: messageTextInterface) {
    const { from, to, text } = message;
    const client = globalClients[`${from}${numberComplement}`];

    if (!client) {
      throw new AppError('Client do not exists or is not active.', 401);
    }

    const { venomClient } = client;

    venomClient.sendText(`${to}${numberComplement}`, text);
  }
}

export { BotService };
