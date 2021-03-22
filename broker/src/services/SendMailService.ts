import * as sendgridmail from '@sendgrid/mail';

import { sendMailInterface } from '../interfaces';

const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = 'no-replay@whatsbroker.com';

sendgridmail.setApiKey(SENDGRID_KEY);

class SendMailService {
  sendMail(mailInfo: sendMailInterface) {
    return sendgridmail.send({
      to: mailInfo.to,
      from: EMAIL_FROM,
      subject: mailInfo.subject,
      html: mailInfo.message,
    });
  }
}

export { SendMailService };
