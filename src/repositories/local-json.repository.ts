import { Injectable } from '@nestjs/common';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import {
  Query as UserQuery,
  Result as UserQueryResult,
} from 'src/use-cases/find-users.use-case';
import { Role } from '../entities/role.enum';
import { User } from '../entities/user.entity';
import { Repository } from '../use-cases/types/repository.types';
import { Record } from './types/record.type';

@Injectable()
export class LocalJsonRepository implements Repository {
  private readonly db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config('elms-database', true, true, '/'));
    if (this.db.exists('/users')) {
      return;
    }
    // deafult 'admin/admin' user
    this.users.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      roles: [Role.Admin],
      name: 'Admin McAdminface',
      bio: 'I am the administrator!',
    });
  }

  readonly users = {
    save: async (user: User) => {
      this.db.push('/users[]', {
        identifier: user.username,
        value: user,
        timestamp: Date.now(),
      });
      return await this.users.find(user.username);
    },

    find: async (username: string): Promise<User> =>
      this.latest(
        this.db
          .getData('/users')
          .filter((record) => record.identifier === username),
      ),

    findByEmail: async (email: string): Promise<User> =>
      this.allLatest<User>(this.db.getData('/users')).find(
        (user) => user.email === email,
      ),

    query: async (query: UserQuery): Promise<UserQueryResult> => {
      const offset = query.offset || 0;
      const limit = query.limit || 100;
      const result = this.allLatest<User>(this.db.getData('/users'))
        .filter(
          (user) =>
            !query.email ||
            user.email
              .toLocaleLowerCase()
              .includes(query.email.toLocaleLowerCase()),
        )
        .filter(
          (user) =>
            !query.username ||
            user.username
              .toLocaleLowerCase()
              .includes(query.username.toLocaleLowerCase()),
        )
        .filter(
          (user) =>
            !query.name ||
            (user.name &&
              user.name
                .toLocaleLowerCase()
                .includes(query.name.toLocaleLowerCase())),
        )
        .filter(
          (user) =>
            !query.roles ||
            query.roles.every(
              (role) => user.roles && user.roles.includes(role),
            ),
        );

      return {
        total: result.length,
        limit: limit,
        offset: offset,
        users: result.slice(offset, offset + limit),
      };
    },
  };

  private readonly latest = <T>(records: Record<T>[]): T => {
    return records.length
      ? records.reduce((recA, recB) =>
          recA.timestamp > recB.timestamp ? recA : recB,
        ).value
      : null;
  };

  private readonly allLatest = <T>(collection: Record<T>[]): T[] =>
    [...new Set(collection.map((record) => record.identifier))]
      .map((identifier) =>
        collection.filter((record) => record.identifier == identifier),
      )
      .map((recordVersions) => this.latest(recordVersions));
}
