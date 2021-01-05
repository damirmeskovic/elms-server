import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import {
  Query as UserQuery,
  Result as UserQueryResult,
} from 'src/use-cases/find-users.use-case';
import { Repository } from 'src/use-cases/types/repository.types';

@Injectable()
export class InMemoryRepository implements Repository {
  private readonly userCollection: User[] = [];

  readonly users = {
    save: async (user: User): Promise<User> => {
      this.userCollection.push(user);
      return await this.users.find(user.username);
    },

    find: async (username: string): Promise<User> =>
      this.userCollection.find((user) => user.username === username),

    findByEmail: async (email: string): Promise<User> =>
      this.userCollection.find((user) => user.email === email),

    query: async (query: UserQuery): Promise<UserQueryResult> => {
      const offset = query.offset || 0;
      const limit = query.limit || 100;
      const result = this.userCollection
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
}
