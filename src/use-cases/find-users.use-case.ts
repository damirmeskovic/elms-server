import { Role } from 'src/entities/role.enum';
import { User } from 'src/entities/user.entity';
import { Repository } from './types/repository.types';

export interface Query {
  readonly email?: string;
  readonly username?: string;
  readonly name?: string;
  readonly roles?: Role[];
  readonly limit?: number;
  readonly offset?: number;
}

export interface Result {
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
  readonly users: User[];
}

export class FindUsers {
  constructor(private readonly repository: Repository) {}

  async with(query: Query): Promise<Result> {
    return this.repository.users.query(query);
  }
}
