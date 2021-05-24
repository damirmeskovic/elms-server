import { Injectable } from '@nestjs/common';
import { Author } from 'src/entities/author.entity';
import { Query, Result } from 'src/use-cases/author/find-authors.use-case';
import { AuthorAssembler } from './author.assembler';
import { Persistence } from '../persistence';
import { AuthorRecord } from './author.record';
import { AuthorRepository as RepositoryInterface } from '../../use-cases/author/author.repository';

@Injectable()
export class AuthorRepository implements RepositoryInterface {
  private readonly assembler: AuthorAssembler;
  constructor(private readonly persistence: Persistence) {
    this.assembler = new AuthorAssembler(persistence);
  }

  save = async (author: Author): Promise<Author> =>
    this.assembler
      .flatten(author)
      .then(this.persistence.persist)
      .then(this.assembler.assemble);

  find = async (authorname: string): Promise<Author> =>
    this.persistence.load('author', authorname).then(this.assembler.assemble);

  query = async (query: Query): Promise<Result> => {
    const offset = query?.offset || 0;
    const limit = query?.limit || 100;
    const authors = await this.persistence
      .loadAll('author')
      .then((records) =>
        records
          .map((record) => record as AuthorRecord)
          .filter(
            (record) =>
              !query?.identifier || record.identifier === query.identifier,
          )
          .filter(
            (record) =>
              !query?.name ||
              record.name
                .toLocaleLowerCase()
                .includes(query.name.toLocaleLowerCase()),
          )
          .filter(
            (record) =>
              !query?.country ||
              (record.country &&
                record.country
                  .toLocaleLowerCase()
                  .includes(query.country.toLocaleLowerCase())),
          )
          .filter(
            (record) =>
              !query?.bio ||
              (record.bio &&
                record.bio
                  .toLocaleLowerCase()
                  .includes(query.bio.toLocaleLowerCase())),
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
      total: authors.length,
      limit: limit,
      offset: offset,
      authors: authors.slice(offset, offset + limit),
    };
  };
}
