import { Injectable } from '@nestjs/common';
import { Persistence } from './persistence';
import { UserRecord } from './user/user.record';
import { Version } from './version.type';
import { BookRecord } from './book/book.record';
import { Record } from './record';
import { AuthorRecord } from './author/author.record';
import { TagRecord } from './tag/tag.record';

type InMemoryCollections = {
  author: Version<AuthorRecord>[];
  book: Version<BookRecord>[];
  tag: Version<TagRecord>[];
  user: Version<UserRecord>[];
};

@Injectable()
export class InMemoryPersistence extends Persistence {
  private readonly collections: InMemoryCollections = {
    author: [],
    book: [],
    tag: [],
    user: [],
  };

  load = (
    typeName: string,
    identifier: string,
    propertyName?: string,
  ): Promise<Record> =>
    this.typeCollection(typeName)
      .then((typeCollection) =>
        typeCollection.filter((recordVersion) =>
          propertyName
            ? recordVersion.value[propertyName] === identifier
            : recordVersion.identifier === identifier,
        ),
      )
      .then(this.latest);

  loadAll = (typeName: string): Promise<Record[]> =>
    this.typeCollection(typeName).then(this.allLatest);

  persist = (record: Record): Promise<Record> =>
    this.typeCollection(record._typeName)
      .then((typeCollection) => typeCollection.push(this.versionOf(record)))
      .then(() =>
        this.load(record._typeName, record[record._identifierProperty]),
      );

  private typeCollection = (typeName: string) =>
    Promise.resolve(this.collections[typeName]);
}
