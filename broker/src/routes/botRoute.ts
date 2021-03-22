import {
  NextFunction, Request, Response, Router,
} from 'express';
import { messageTextInterface } from '../interfaces';
import { BotController } from '../controllers';
import {
  botAuthenticateMiddleware, roleAuthentticateMiddleware, userAuthenticateMiddleware,
} from '../middlewares';
import { roleEnum } from '../utils/enum/roles';

const botController = new BotController();
const router = Router();

router.post(
  '/bots/start/all',
  [userAuthenticateMiddleware, roleAuthentticateMiddleware([roleEnum.ADMIN])],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await botController.startAllBots();

      res.json({
        ok: true,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/bots/send/text',
  botAuthenticateMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { to, message } = req.body;
      const textMessage: messageTextInterface = {
        from: req.clientBot, to, text: message,
      };

      await botController.sendTextMessage(textMessage);

      res.json({
        ok: true,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
