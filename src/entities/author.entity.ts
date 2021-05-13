import { Tag } from './tag.entity';

export interface Author {
  readonly identifier: string;
  readonly name: string;
  readonly country: string;
  readonly bio?: string;
  readonly tags?: Tag[];
}
