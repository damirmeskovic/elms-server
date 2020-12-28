import { Injectable } from '@nestjs/common';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { User } from 'src/entities/user.entity';
import { Repository } from 'src/use-cases/types/repository.types';

@Injectable()
export class LocalJsonRepository implements Repository {
  private readonly db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config('elms-database', true, true, '/'));
    if (this.db.exists('/users')) {
      return;
    }
    // deafult 'admin/admin' user
    this.db.push('/users[0]', {
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      name: 'Admin McAdminface',
      bio: 'I am the administrator!',
    });
  }

  readonly users = {
    save: async (user: User) => {
      this.db.push('/users[]', user);
      return await this.users.find(user.username);
    },

    find: async (username: string): Promise<User> =>
      this.db.getData('/users').find((user) => user.username === username),

    findByEmail: async (email: string): Promise<User> =>
      this.db.getData('/users').find((user) => user.email === email),
  };
}
