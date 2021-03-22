import {
  NextFunction, Request, Response, Router,
} from 'express';

import { UserController } from '../controllers';

const userController = new UserController();
const router = Router();

router.post('/users/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email, password,
    } = req.body;

    const user = await userController.login(email, password);

    res.json({
      ok: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
