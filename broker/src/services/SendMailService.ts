import * as sendgridmail from '@sendgrid/mail';

import { sendMailInterface } from '../interfaces';

class SendMailService {
  sendGridKey: string;

  emailFrom: string = 'no-replay@whatsbroker.com';

  constructor() {
    this.sendGridKey = process.env.SENDGRID_API_KEY;

    sendgridmail.setApiKey(this.sendGridKey);
  }

  sendMail(mailInfo: sendMailInterface) {
    return sendgridmail.send({
      to: mailInfo.to,
      from: this.emailFrom,
      subject: mailInfo.subject,
      html: mailInfo.message,
    });
  }
}

export { SendMailService };
