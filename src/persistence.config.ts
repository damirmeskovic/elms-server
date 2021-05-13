import { LocalJsonPersistence } from './persistence/local-json.persistence';
import {
  BookRepository,
  UserRepository,
} from './use-cases/types/repository.types';
import { UserRepository as UserRepositoryImpl } from './persistence/user/user.repository';
import { BookRepository as BookRepositoryImpl } from './persistence/book/book.repository';
import { Persistence } from './persistence/persistence';

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
