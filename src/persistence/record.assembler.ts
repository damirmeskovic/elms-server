import { Record } from './record';

export abstract class RecordAssembler<R extends Record, T> {
  abstract assemble(record: R): Promise<T>;
  abstract flatten(type: T): Promise<R>;

  assembleAll = (records: R[]): Promise<T[]> =>
    Promise.all(records.map(this.assemble));

  flattenAll = (types: T[]): Promise<R[]> =>
    Promise.all(types.map(this.flatten));
}
