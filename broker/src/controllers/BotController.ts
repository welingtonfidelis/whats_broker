import { messageTextInterface } from '../interfaces';
import { BotService } from '../services';

const botService = new BotService();

class BotController {
  startAllBots() {
    return botService.startAllBots();
  }

  sendTextMessage(message: messageTextInterface) {
    return botService.sendTextMessage(message);
  }
}

export { BotController };
