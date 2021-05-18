import { Book } from '../../entities/book.entity';
import {
  Query as BookQuery,
  Result as BookQueryResult,
} from './find-books.use-case';

export abstract class BookRepository {
  abstract save(item: Book): Promise<Book>;

  abstract find(identifier: string): Promise<Book>;

  abstract query(query: BookQuery): Promise<BookQueryResult>;
}
