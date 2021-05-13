import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository as RepositoryInterface } from 'src/use-cases/types/repository.types';
import {
  Query as UserQuery,
  Result as UserQueryResult,
} from 'src/use-cases/find-users.use-case';
import { UserAssembler } from './user.assembler';
import { Persistence } from '../persistence';
import { UserRecord } from './user.record';

@Injectable()
export class UserRepository implements RepositoryInterface {
  private readonly assembler: UserAssembler;
  constructor(private readonly persistence: Persistence) {
    this.assembler = new UserAssembler(persistence);
  }

  async save(user: User): Promise<User> {
    return this.assembler
      .flatten(user)
      .then(this.persistence.persist)
      .then(this.assembler.assemble);
  }

  async find(username: string): Promise<User> {
    return this.persistence
      .load('user', username)
      .then(this.assembler.assemble);
  }

  async findByEmail(email: string): Promise<User> {
    return this.persistence
      .load('user', email, 'email')
      .then(this.assembler.assemble);
  }

  async query(query: UserQuery): Promise<UserQueryResult> {
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    const users = await this.persistence
      .loadAll('user')
      .then((records) =>
        records
          .map((record) => record as UserRecord)
          .filter(
            (userRecord) =>
              !query.email ||
              userRecord.email
                .toLocaleLowerCase()
                .includes(query.email.toLocaleLowerCase()),
          )
          .filter(
            (userRecord) =>
              !query.username ||
              userRecord.username
                .toLocaleLowerCase()
                .includes(query.username.toLocaleLowerCase()),
          )
          .filter(
            (userRecord) =>
              !query.name ||
              (userRecord.name &&
                userRecord.name
                  .toLocaleLowerCase()
                  .includes(query.name.toLocaleLowerCase())),
          )
          .filter(
            (userRecord) =>
              !query.roles ||
              query.roles.every(
                (role) => userRecord.roles && userRecord.roles.includes(role),
              ),
          ),
      )
      .then(this.assembler.assembleAll);

    return {
      total: users.length,
      limit: limit,
      offset: offset,
      users: users.slice(offset, offset + limit),
    };
  }
}
