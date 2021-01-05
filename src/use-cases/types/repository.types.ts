import { User } from 'src/entities/user.entity';
import {
  Query as UserQuery,
  Result as UserQueryResult,
} from '../find-users.use-case';

export interface UserRepository {
  save(item: User): Promise<User>;
  find(username: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  query(query: UserQuery): Promise<UserQueryResult>;
}

export class Repository {
  readonly users: UserRepository;
}
