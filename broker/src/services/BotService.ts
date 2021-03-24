import * as venom from 'venom-bot';
import axios from 'axios';
import { resolve } from 'path';

import { ClientRepository } from '../repositories';
import { SendMailService } from './SendMailService';
import { HtmlService } from './HtmlService';
import { UploadS3Service } from './UploadS3Service';
import { AppError } from '../errors';
import { messageTextInterface } from '../interfaces';

const globalClients = {};
const numberComplement = '@c.us';

class BotService {
  async startAllBots() {
    const clientRepository = new ClientRepository();
    const clients = await clientRepository.indexActives();

    await Promise.all(
      clients.map((item) => {
        const uploadedFilesTemp = [];

        return venom
          .create(
            `bot_${item.number}`,
            async (base64Qrimg) => {
              const uploadS3Service = new UploadS3Service();
              const sendMailService = new SendMailService();
              const htmlService = new HtmlService();

              const uploadedFile = await uploadS3Service.uploadImageBase64(base64Qrimg, 'qrcode');
              uploadedFilesTemp.push(uploadedFile.Location);

              const htmlTemplate = resolve(__dirname, '..', 'views', 'html', 'qrcodeScan.hbs');
              const html = htmlService.create(
                htmlTemplate,
                {
                  client_name: item.name,
                  client_number: item.number,
                  qrcode: uploadedFile.Location,
                },
              );

              sendMailService.sendMail({
                to: item.email,
                subject: 'teste',
                message: html,
              });
            },
            null,
            { puppeteerOptions: { args: ['--no-sandbox'] } },
          )
          .then((client) => {
            const clientNumber = `${item.number}${numberComplement}`;

            globalClients[clientNumber] = {
              ...item,
              venomClient: client,
            };

            this.startBot(item.number);

            this.deleteQrCodeFromS3(uploadedFilesTemp);
          })
          .catch((error) => {
            console.log(error);

            this.deleteQrCodeFromS3(uploadedFilesTemp);
          });
      }),
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
    const client = globalClients[from];

    if (!client) {
      throw new AppError('Client do not exists or is not active.', 401);
    }

    const { venomClient } = client;

    venomClient.sendText(`${to}${numberComplement}`, text);
  }

  private async deleteQrCodeFromS3(files: string[]) {
    const uploadS3Service = new UploadS3Service();

    await Promise.all(
      files.map((file) => {
        const [_, url] = file.split('/images/');

        return uploadS3Service.deleteFile(`images/${url}`);
      }),
    );
  }
}

export { BotService };
