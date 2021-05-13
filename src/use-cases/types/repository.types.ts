import { Book } from 'src/entities/book.entity';
import { User } from 'src/entities/user.entity';
import {
  Query as BookQuery,
  Result as BookQueryResult,
} from '../find-books.use-case';
import {
  Query as UserQuery,
  Result as UserQueryResult,
} from '../find-users.use-case';

export abstract class UserRepository {
  abstract save(item: User): Promise<User>;
  abstract find(username: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
  abstract query(query: UserQuery): Promise<UserQueryResult>;
}

export abstract class BookRepository {
  abstract save(item: Book): Promise<Book>;
  abstract find(identifier: string): Promise<Book>;
  abstract query(query: BookQuery): Promise<BookQueryResult>;
}
