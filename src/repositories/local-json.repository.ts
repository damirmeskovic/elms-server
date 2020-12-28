import { Injectable } from '@nestjs/common';
import { Repository } from 'src/use-cases/types/repository.types';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { User } from 'src/entities/user.entity';

@Injectable()
export class LocalJsonRepository implements Repository {
  private readonly db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config('elms-database', true, true, '/'));
    // deafult 'admin/admin' user
    this.db.push('/users[0]', {
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      bio: 'I am the administrator!',
    });
  }

  readonly users = {
    find: async (username: string): Promise<User> =>
      this.db.getData('/users/').find((user) => user.username === username),

    save: (user: User) => this.db.push('/users[]', user),
  };
}
