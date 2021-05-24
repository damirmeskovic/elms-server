import { Tag } from 'src/entities/tag.entity';
import { TagRepository } from './tag.repository';

export interface Query {
  readonly identifier?: string;
  readonly name?: string;
  readonly description?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface Result {
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
  readonly tags: Tag[];
}

export class FindTags {
  constructor(private readonly tags: TagRepository) {}

  async with(query: Query): Promise<Result> {
    return this.tags.query(query);
  }
}
