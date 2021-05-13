import { Role } from 'src/entities/role.enum';
import { Record } from '../record';

export class UserRecord implements Record {
  readonly _typeName = 'user';
  readonly _identifierProperty = 'username';
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly roles?: Role[];
  readonly name?: string;
  readonly bio?: string;
}
