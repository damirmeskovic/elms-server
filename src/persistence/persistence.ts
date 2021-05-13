import { Record } from './record';
import { Version } from './version.type';

export abstract class Persistence {
  abstract persist(record: Record): Promise<Record>;

  abstract load(
    typeName: string,
    identifier: string,
    propertyName?: string,
  ): Promise<Record>;

  abstract loadAll(typeName: string): Promise<Record[]>;

  protected readonly latest = <R extends Record>(
    recordVersions: Version<R>[],
  ): R => {
    return recordVersions.length
      ? recordVersions.reduce((recA, recB) =>
          recA.timestamp > recB.timestamp ? recA : recB,
        ).value
      : null;
  };

  protected readonly allLatest = <R extends Record>(
    collection: Version<R>[],
  ): R[] =>
    [...new Set(collection.map((recordVersion) => recordVersion.identifier))]
      .map((identifier) =>
        collection.filter(
          (recordVersion) => recordVersion.identifier == identifier,
        ),
      )
      .map((recordVersions) => this.latest(recordVersions));

  protected readonly versionOf = <R extends Record>(record: R): Version<R> => ({
    identifier: record[record._identifierProperty],
    value: record,
    timestamp: Date.now(),
  });
}
