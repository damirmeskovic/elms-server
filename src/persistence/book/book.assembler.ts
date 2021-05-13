import { Book } from 'src/entities/book.entity';
import { RecordAssembler } from '../record.assembler';
import { BookRecord } from './book.record';
import { Persistence } from '../persistence';

export class BookAssembler extends RecordAssembler<BookRecord, Book> {
  constructor(private readonly persistence: Persistence) {
    super();
  }

  assemble(record: BookRecord): Promise<Book> {
    throw new Error('Method not implemented.');
  }

  flatten(type: Book): Promise<BookRecord> {
    throw new Error('Method not implemented.');
  }
}
