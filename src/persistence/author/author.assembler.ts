import { Author } from 'src/entities/author.entity';
import { RecordAssembler } from '../record.assembler';
import { AuthorRecord } from './author.record';
import { Persistence } from '../persistence';

export class AuthorAssembler extends RecordAssembler<AuthorRecord, Author> {
  constructor(private readonly persistence: Persistence) {
    super();
  }

  assemble(record: AuthorRecord): Promise<Author> {
    throw new Error('Method not implemented.');
  }

  flatten(type: Author): Promise<AuthorRecord> {
    throw new Error('Method not implemented.');
  }
}
