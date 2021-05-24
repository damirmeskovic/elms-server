import { Book } from 'src/entities/book.entity';
import { RecordAssembler } from '../record.assembler';
import { BookRecord } from './book.record';
import { Persistence } from '../persistence';
import { TagAssembler } from '../tag/tag.assembler';
import { AuthorAssembler } from '../author/author.assembler';
import { TagRecord } from '../tag/tag.record';
import { AuthorRecord } from '../author/author.record';

export class BookAssembler extends RecordAssembler<BookRecord, Book> {
  private readonly tagAssembler: TagAssembler;
  private readonly authorAssembler: AuthorAssembler;

  constructor(private readonly persistence: Persistence) {
    super();
    this.tagAssembler = new TagAssembler();
    this.authorAssembler = new AuthorAssembler(persistence);
  }

  assemble = (record: BookRecord): Promise<Book> => {
    if (record === null) return Promise.resolve(null);
    const tags = (record.tagIdentifiers || []).map((tagIdentifier) =>
      this.persistence
        .load('tag', tagIdentifier)
        .then(this.tagAssembler.assemble),
    );

    const authors = (record.authorIdentifiers || []).map((authorIdentifier) =>
      this.persistence
        .load('author', authorIdentifier)
        .then(this.authorAssembler.assemble),
    );

    return Promise.all(tags)
      .then((tags) =>
        Promise.all(authors).then((authors) => ({ tags, authors })),
      )
      .then(({ tags, authors }) => ({
        identifier: record.identifier,
        title: record.title,
        description: record.description,
        authors,
        tags,
      }));
  };

  flatten = (book: Book): Promise<BookRecord> => {
    const tagIdentifiers = (book.tags || []).map((tag) =>
      this.tagAssembler
        .flatten(tag)
        .then(this.persistence.persist)
        .then((record) => record as TagRecord)
        .then((tagRecord) => tagRecord.identifier),
    );

    const authorIdentifiers = (book.authors || []).map((author) =>
      this.authorAssembler
        .flatten(author)
        .then(this.persistence.persist)
        .then((record) => record as AuthorRecord)
        .then((authorRecord) => authorRecord.identifier),
    );

    return Promise.all(tagIdentifiers)
      .then((tagIdentifiers) =>
        Promise.all(authorIdentifiers).then((authorIdentifiers) => ({
          tagIdentifiers,
          authorIdentifiers,
        })),
      )
      .then(({ tagIdentifiers, authorIdentifiers }) => ({
        _typeName: 'book',
        _identifierProperty: 'identifier',
        identifier: book.identifier,
        title: book.title,
        description: book.description,
        tagIdentifiers,
        authorIdentifiers,
      }));
  };
}
