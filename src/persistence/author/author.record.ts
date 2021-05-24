import { Record } from '../record';

export class AuthorRecord implements Record {
  readonly _typeName = 'author';
  readonly _identifierProperty = 'identifier';
  readonly identifier: string;
  readonly name: string;
  readonly country: string;
  readonly bio?: string;
  readonly tagIdentifiers?: string[];
}
