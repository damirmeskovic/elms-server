import { BooksController } from './book/books.controller';
import { UserController } from './user/user.controller';
import { UsersController } from './user/users.controller';
import { AuthorsController } from './author/authors.controller';
import { TagsController } from './tag/tags.controller';

export default [
  AuthorsController,
  BooksController,
  TagsController,
  UserController,
  UsersController,
];
