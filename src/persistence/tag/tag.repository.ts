import { Injectable } from '@nestjs/common';
import { Tag } from 'src/entities/tag.entity';
import { Query, Result } from 'src/use-cases/tag/find-tags.use-case';
import { TagAssembler } from './tag.assembler';
import { Persistence } from '../persistence';
import { TagRecord } from './tag.record';
import { TagRepository as RepositoryInterface } from '../../use-cases/tag/tag.repository';

@Injectable()
export class TagRepository implements RepositoryInterface {
  private readonly assembler: TagAssembler;

  constructor(private readonly persistence: Persistence) {
    this.assembler = new TagAssembler();
  }

  save = async (tag: Tag): Promise<Tag> =>
    this.assembler
      .flatten(tag)
      .then(this.persistence.persist)
      .then(this.assembler.assemble);

  find = async (tagname: string): Promise<Tag> =>
    this.persistence.load('tag', tagname).then(this.assembler.assemble);

  query = async (query: Query): Promise<Result> => {
    const offset = query?.offset || 0;
    const limit = query?.limit || 100;
    const tags = await this.persistence
      .loadAll('tag')
      .then((records) =>
        records
          .map((record) => record as TagRecord)
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
              !query?.description ||
              (record.description &&
                record.description
                  .toLocaleLowerCase()
                  .includes(query.description.toLocaleLowerCase())),
          ),
      )
      .then(this.assembler.assembleAll);

    return {
      total: tags.length,
      limit: limit,
      offset: offset,
      tags: tags.slice(offset, offset + limit),
    };
  };
}
