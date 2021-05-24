import { Query, Result } from './find-authors.use-case';
import { Author } from '../../entities/author.entity';

export abstract class AuthorRepository {
  abstract save(item: Author): Promise<Author>;

  abstract find(identifier: string): Promise<Author>;

  abstract query(query: Query): Promise<Result>;
}
