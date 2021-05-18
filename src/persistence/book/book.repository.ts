import { Injectable } from '@nestjs/common';
import { Book } from 'src/entities/book.entity';
import {
  Query as BookQuery,
  Result as BookQueryResult,
} from 'src/use-cases/book/find-books.use-case';
import { BookAssembler } from './book.assembler';
import { Persistence } from '../persistence';
import { BookRecord } from './book.record';
import { BookRepository as RepositoryInterface } from '../../use-cases/book/book.repository';

@Injectable()
export class BookRepository implements RepositoryInterface {
  private readonly assembler: BookAssembler;
  constructor(private readonly persistence: Persistence) {
    this.assembler = new BookAssembler(persistence);
  }

  async save(book: Book): Promise<Book> {
    return this.assembler
      .flatten(book)
      .then(this.persistence.persist)
      .then(this.assembler.assemble);
  }

  async find(bookname: string): Promise<Book> {
    return this.persistence
      .load('book', bookname)
      .then(this.assembler.assemble);
  }

  async findByEmail(email: string): Promise<Book> {
    return this.persistence
      .load('book', email, 'email')
      .then(this.assembler.assemble);
  }

  async query(query: BookQuery): Promise<BookQueryResult> {
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    const books = await this.persistence
      .loadAll('book')
      .then(
        (records) => records.map((record) => record as BookRecord),
        // .filter(
        //   (bookRecord) =>
        //     !query.email ||
        //     bookRecord.email
        //       .toLocaleLowerCase()
        //       .includes(query.email.toLocaleLowerCase()),
        // )
        // .filter(
        //   (bookRecord) =>
        //     !query.bookname ||
        //     bookRecord.bookname
        //       .toLocaleLowerCase()
        //       .includes(query.bookname.toLocaleLowerCase()),
        // )
        // .filter(
        //   (bookRecord) =>
        //     !query.name ||
        //     (bookRecord.name &&
        //       bookRecord.name
        //         .toLocaleLowerCase()
        //         .includes(query.name.toLocaleLowerCase())),
        // )
        // .filter(
        //   (bookRecord) =>
        //     !query.roles ||
        //     query.roles.every(
        //       (role) => bookRecord.roles && bookRecord.roles.includes(role),
        //     ),
        // ),
      )
      .then(this.assembler.assembleAll);

    return {
      total: books.length,
      limit: limit,
      offset: offset,
      books: books.slice(offset, offset + limit),
    };
  }
}
