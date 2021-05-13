import { Injectable } from '@nestjs/common';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { Role } from '../entities/role.enum';
import { Record } from './record';
import { Persistence } from './persistence';
import { Version } from './version.type';

@Injectable()
export class LocalJsonPersistence extends Persistence {
  private readonly db: JsonDB;

  private readonly typeCollections = {
    user: '/users',
    book: '/books',
  };

  constructor() {
    super();
    this.db = new JsonDB(new Config('elms-database', true, true, '/'));
    if (this.db.exists('/users')) {
      return;
    }
    // deafult 'admin/admin' user
    this.db.push(
      `${this.typeCollections.user}[]`,
      this.versionOf({
        _typeName: 'user',
        _identifierProperty: 'username',
        email: 'admin@email.com',
        username: 'admin',
        password: 'admin',
        roles: [Role.Admin],
        name: 'Admin McAdminface',
        bio: 'I am the administrator!',
      }),
    );
  }

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

  persist = (record: Record): Promise<Record> => {
    this.db.push(
      `${this.typeCollections[record._typeName]}[]`,
      this.versionOf(record),
    );
    return this.load(record._typeName, record[record._identifierProperty]);
  };

  private typeCollection = <R extends Record>(
    typeName: string,
  ): Promise<Version<R>[]> =>
    Promise.resolve(this.db.getData(this.typeCollections[typeName]));
}
