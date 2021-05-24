import { Author } from 'src/entities/author.entity';
import { AuthorRepository } from './author.repository';

export interface Query {
  readonly identifier?: string;
  readonly name?: string;
  readonly country?: string;
  readonly bio?: string;
  readonly tagIdentifiers?: string[];
  readonly limit?: number;
  readonly offset?: number;
}

export interface Result {
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
  readonly authors: Author[];
}

export class FindAuthors {
  constructor(private readonly authors: AuthorRepository) {}

  async with(query: Query): Promise<Result> {
    return this.authors.query(query);
  }
}
