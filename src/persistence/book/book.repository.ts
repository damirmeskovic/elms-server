import { Injectable } from '@nestjs/common';
import { Book } from 'src/entities/book.entity';
import { Query, Result } from 'src/use-cases/book/find-books.use-case';
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

  save = async (book: Book): Promise<Book> =>
    this.assembler
      .flatten(book)
      .then(this.persistence.persist)
      .then(this.assembler.assemble);

  find = async (bookname: string): Promise<Book> =>
    this.persistence.load('book', bookname).then(this.assembler.assemble);

  query = async (query: Query): Promise<Result> => {
    const offset = query?.offset || 0;
    const limit = query?.limit || 100;
    const books = await this.persistence
      .loadAll('book')
      .then((records) =>
        records
          .map((record) => record as BookRecord)
          .filter(
            (record) =>
              !query?.identifier || record.identifier === query.identifier,
          )
          .filter(
            (record) =>
              !query?.title ||
              record.title
                .toLocaleLowerCase()
                .includes(query.title.toLocaleLowerCase()),
          )
          .filter(
            (record) =>
              !query?.description ||
              (record.description &&
                record.description
                  .toLocaleLowerCase()
                  .includes(query.description.toLocaleLowerCase())),
          )
          .filter(
            (record) =>
              !query?.authorIdentifiers ||
              query.authorIdentifiers.every((authorIdentifier) =>
                record.authorIdentifiers.includes(authorIdentifier),
              ),
          )
          .filter(
            (record) =>
              !query?.tagIdentifiers ||
              query.tagIdentifiers.every(
                (tagIdentifier) =>
                  record.tagIdentifiers &&
                  record.tagIdentifiers.includes(tagIdentifier),
              ),
          ),
      )
      .then(this.assembler.assembleAll);

    return {
      total: books.length,
      limit: limit,
      offset: offset,
      books: books.slice(offset, offset + limit),
    };
  };
}
