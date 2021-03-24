import * as jwt from 'jsonwebtoken';
import { resolve } from 'path';

import { clientCreateInterface } from '../interfaces';
import { ClientRepository } from '../repositories';

import { SendMailService } from './SendMailService';
import { HtmlService } from './HtmlService';

const clientRepository = new ClientRepository();

class ClientService {
  total() {
    return clientRepository.total();
  }

  index(page: number, limit: number) {
    return clientRepository.index(page, limit);
  }

  async store(client: clientCreateInterface) {
    const sendMailService = new SendMailService();
    const htmlService = new HtmlService();

    const insertedClient = await clientRepository.store(client);

    const jwtSecret: string = process.env.JWT_SECRET_BOT;

    const botKey = jwt.sign(
      {
        clientBot: `${client.number}@c.us`,
        clientId: insertedClient.id,
      },
      jwtSecret,
    );

    await clientRepository.updateBotKey(insertedClient.id, botKey);

    const htmlTemplate = resolve(__dirname, '..', 'views', 'html', 'botKeySend.hbs');
    const html = htmlService.create(
      htmlTemplate,
      {
        client_name: client.name,
        client_number: client.number,
        bot_key: botKey,
      },
    );

    sendMailService.sendMail({
      to: client.email,
      subject: 'Your bot key',
      message: html,
    });

    return insertedClient;
  }

  update(id: number, number: string) {
    return clientRepository.update(id, number);
  }

  delete(id: number) {
    return clientRepository.delete(id);
  }
}

export { ClientService };
