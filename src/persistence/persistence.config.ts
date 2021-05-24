import { LocalJsonPersistence } from './local-json.persistence';
import { UserRepository } from '../use-cases/user/user.repository';
import { AuthorRepository as AuthorRepositoryImpl } from './author/author.repository';
import { BookRepository as BookRepositoryImpl } from './book/book.repository';
import { UserRepository as UserRepositoryImpl } from './user/user.repository';
import { Persistence } from './persistence';
import { BookRepository } from '../use-cases/book/book.repository';
import { AuthorRepository } from '../use-cases/author/author.repository';

const persistence = {
  provide: Persistence,
  useFactory: () => new LocalJsonPersistence(),
};

const authorRepository = {
  provide: AuthorRepository,
  useFactory: (persistence: Persistence) =>
    new AuthorRepositoryImpl(persistence),
  inject: [Persistence],
};

const bookRepository = {
  provide: BookRepository,
  useFactory: (persistence: Persistence) => new BookRepositoryImpl(persistence),
  inject: [Persistence],
};

const userRepository = {
  provide: UserRepository,
  useFactory: (persistence: Persistence) => new UserRepositoryImpl(persistence),
  inject: [Persistence],
};

export default [authorRepository, persistence, userRepository, bookRepository];
