import { Record } from '../record';

export class BookRecord implements Record {
  readonly _typeName = 'book';
  readonly _identifierProperty = 'title';
  readonly title: string;
  readonly authorIdentifiers: string[];
  readonly description?: string;
  readonly tagIdentifiers?: string[];
}
