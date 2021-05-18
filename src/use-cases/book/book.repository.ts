import { Book } from '../../entities/book.entity';
import { Query, Result } from './find-books.use-case';

export abstract class BookRepository {
  abstract save(item: Book): Promise<Book>;

  abstract find(identifier: string): Promise<Book>;

  abstract query(query: Query): Promise<Result>;
}
