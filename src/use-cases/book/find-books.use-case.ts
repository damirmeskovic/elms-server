import { Book } from 'src/entities/book.entity';
import { BookRepository } from './book.repository';

export interface Query {
  readonly identifier?: string;
  readonly title?: string;
  readonly authorIdentifiers?: string[];
  readonly description?: string;
  readonly tagIdentifiers?: string[];
  readonly limit?: number;
  readonly offset?: number;
}

export interface Result {
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
  readonly books: Book[];
}

export class FindBooks {
  constructor(private readonly books: BookRepository) {}

  async with(query: Query): Promise<Result> {
    return this.books.query(query);
  }
}
