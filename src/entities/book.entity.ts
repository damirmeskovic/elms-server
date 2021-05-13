import { Author } from './author.entity';
import { Tag } from './tag.entity';

export interface Book {
  readonly identifier: string;
  readonly title: string;
  readonly authors: Author[];
  readonly description?: string;
  readonly tags?: Tag[];
}
