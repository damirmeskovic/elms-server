import { LocalJsonPersistence } from './local-json.persistence';
import { UserRepository } from '../use-cases/user/user.repository';
import { UserRepository as UserRepositoryImpl } from './user/user.repository';
import { BookRepository as BookRepositoryImpl } from './book/book.repository';
import { Persistence } from './persistence';
import { BookRepository } from '../use-cases/book/book.repository';

const persistence = {
  provide: Persistence,
  useFactory: () => new LocalJsonPersistence(),
};

const userRepository = {
  provide: UserRepository,
  useFactory: (persistence: Persistence) => new UserRepositoryImpl(persistence),
  inject: [Persistence],
};

const bookRepository = {
  provide: BookRepository,
  useFactory: (persistence: Persistence) => new BookRepositoryImpl(persistence),
  inject: [Persistence],
};

export default [persistence, userRepository, bookRepository];
