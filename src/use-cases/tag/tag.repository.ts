import { Query, Result } from './find-tags.use-case';
import { Tag } from '../../entities/tag.entity';

export abstract class TagRepository {
  abstract save(item: Tag): Promise<Tag>;

  abstract find(identifier: string): Promise<Tag>;

  abstract query(query: Query): Promise<Result>;
}
