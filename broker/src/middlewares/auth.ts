import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError } from '../errors';
import { tokenBotInterface, tokenClientInterface } from '../interfaces';
import { roleEnum } from '../utils/enum/roles';

const userAuthenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const jwtSecret: string = process.env.JWT_SECRET_USER;
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError('Authentication token is required.', 401);
  }

  const token = authorization.replace('Bearer', '').trim();
  const data = jwt.verify(token, jwtSecret);
  const { userId, clientId, userRole } = data as tokenClientInterface;

  req.userId = userId;
  req.clientId = clientId;
  req.userRole = userRole;

  return next();
};

const botAuthenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const jwtSecret: string = process.env.JWT_SECRET_BOT;
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError('Authentication token is required.', 401);
  }

  const token = authorization.replace('Bearer', '').trim();
  const data = jwt.verify(token, jwtSecret);
  const { clientBot, clientId } = data as tokenBotInterface;

  req.clientId = clientId;
  req.clientBot = clientBot;

  return next();
};

const roleAuthentticateMiddleware = (roles: roleEnum[]) => (
  (req: Request, res: Response, next: NextFunction) => {
    const { userRole } = req;

    if (!userRole) {
      throw new AppError('Action not permitted to you role.', 401);
    }

    for (let i = 0; i < roles.length; i += 1) {
      const role = roles[i];

      if (userRole !== role) {
        throw new AppError('Action not permitted to you role.', 401);
      }
    }

    return next();
  }
);

export {
  userAuthenticateMiddleware, botAuthenticateMiddleware, roleAuthentticateMiddleware,
};
