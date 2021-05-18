import { User } from 'src/entities/user.entity';
import {
  Query as UserQuery,
  Result as UserQueryResult,
} from './find-users.use-case';

export abstract class UserRepository {
  abstract save(item: User): Promise<User>;
  abstract find(username: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
  abstract query(query: UserQuery): Promise<UserQueryResult>;
}
