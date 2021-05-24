import { Record } from '../record';

export class TagRecord implements Record {
  readonly _typeName: 'tag';
  readonly _identifierProperty: 'name';
  readonly name: string;
  readonly description: string;
}
