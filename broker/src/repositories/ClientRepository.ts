import { getRepository } from 'typeorm';
import { clientCreateInterface, clientUpdateInterface } from '../interfaces';
import { Client } from '../models';

class ClientRepository {
  public total() {
    const repository = getRepository(Client);

    return repository.count();
  }

  index(page: number, limit: number) {
    const repository = getRepository(Client);

    return repository.find({
      skip: page,
      take: limit,
      order: { name: 'ASC' },
    });
  }

  indexActives() {
    const repository = getRepository(Client);

    return repository.find({
      where: { active: true },
      order: { name: 'ASC' },
    });
  }

  store(client: clientCreateInterface) {
    const repository = getRepository(Client);

    const insertedClient = repository.create(client);

    return repository.save(insertedClient);
  }

  update(id: string, client: clientUpdateInterface) {
    const repository = getRepository(Client);

    return repository.update(id, client);
  }

  updateBotKey(id: string, botKey: string) {
    const repository = getRepository(Client);

    return repository.update(id, { botKey });
  }

  delete(id: number) {
    const repository = getRepository(Client);

    return repository.delete({ id });
  }

  deleteByNumber(clientNumber: string) {
    const repository = getRepository(Client);

    return repository.delete({ number: clientNumber });
  }
}

export { ClientRepository };
