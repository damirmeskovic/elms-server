import { Author } from 'src/entities/author.entity';
import { RecordAssembler } from '../record.assembler';
import { AuthorRecord } from './author.record';
import { Persistence } from '../persistence';
import { TagAssembler } from '../tag/tag.assembler';
import { TagRecord } from '../tag/tag.record';

export class AuthorAssembler extends RecordAssembler<AuthorRecord, Author> {
  private readonly tagAssembler: TagAssembler;
  constructor(private readonly persistence: Persistence) {
    super();
    this.tagAssembler = new TagAssembler();
  }

  assemble = async (record: AuthorRecord): Promise<Author> => {
    if (record === null) return Promise.resolve(null);
    return Promise.all(
      (record.tagIdentifiers || []).map((tagIdentifier) =>
        this.persistence
          .load('tag', tagIdentifier)
          .then(this.tagAssembler.assemble),
      ),
    ).then((tags) => ({
      identifier: record.identifier,
      name: record.name,
      country: record.country,
      bio: record.bio,
      tags,
    }));
  };

  flatten = (author: Author): Promise<AuthorRecord> =>
    Promise.all(
      (author.tags || []).map((tag) =>
        this.tagAssembler
          .flatten(tag)
          .then(this.persistence.persist)
          .then((record) => record as TagRecord)
          .then((tagRecord) => tagRecord.identifier),
      ),
    ).then((tagIdentifiers) => ({
      _typeName: 'author',
      _identifierProperty: 'identifier',
      identifier: author.identifier,
      name: author.name,
      country: author.country,
      bio: author.bio,
      tagIdentifiers: tagIdentifiers,
    }));
}
