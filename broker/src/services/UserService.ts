import { compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { AppError } from '../errors';
import { UserRepository } from '../repositories';

const userRepository = new UserRepository();

class UserService {
  async login(email: string, password: string) {
    const user = await userRepository.showByEmail(email);

    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const {
      id, password: hash, active, role, clientId, name,
    } = user;

    const isValid = compareSync(password, hash);

    if (!isValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    if (!active) {
      throw new AppError('Inactive user.', 401);
    }

    const jwtSecret: string = process.env.JWT_SECRET_USER;

    const token = jwt.sign(
      {
        userId: id,
        clientId,
        userRole: role,
      },
      jwtSecret,
      {
        expiresIn: '10h',
      },
    );

    return { name, role, token };
  }
}

export { UserService };
