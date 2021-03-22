import { Router } from 'express';

import clientRoutes from './clientRoute';
import botRoutes from './botRoute';
import userRoutes from './userRoute';

const router = Router();

router.use(clientRoutes);
router.use(botRoutes);
router.use(userRoutes);

export { router };
