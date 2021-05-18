import { RecordAssembler } from '../record.assembler';
import { UserRecord } from './user.record';
import { User } from '../../entities/user.entity';
import { Persistence } from '../persistence';

export class UserAssembler extends RecordAssembler<UserRecord, User> {
  constructor(private readonly persistence: Persistence) {
    super();
  }

  assemble = (record: UserRecord): Promise<User> => {
    if (record === null) return Promise.resolve(null);
    const { _typeName, _identifierProperty, ...user } = record;
    return Promise.resolve(user);
  };

  flatten = (user: User): Promise<UserRecord> =>
    Promise.resolve({
      _typeName: 'user',
      _identifierProperty: 'username',
      ...user,
    });
}
