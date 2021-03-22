import {
  NextFunction, Request, Response, Router,
} from 'express';
import { clientCreateInterface } from '../interfaces/client/create';

import { ClientController } from '../controllers';
import { roleAuthentticateMiddleware, userAuthenticateMiddleware } from '../middlewares';
import { roleEnum } from '../utils/enum/roles';

const clientController = new ClientController();
const router = Router();

router.post(
  '/clients',
  [userAuthenticateMiddleware, roleAuthentticateMiddleware([roleEnum.ADMIN])],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name, number, email, end_point: endPoint,
      } = req.body;

      const client: clientCreateInterface = {
        name, number, email, endPoint, botKey: 'waiting', active: true,
      };

      const insertedClient = await clientController.store(client);

      res.json({
        ok: true,
        data: {
          id: insertedClient.id,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
