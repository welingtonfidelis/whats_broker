import { getRepository } from 'typeorm';
import { User } from '../models';

class UserRepository {
  showByEmail(email: string) {
    const repository = getRepository(User);

    return repository.findOne({ where: { email } });
  }
}

export { UserRepository };
