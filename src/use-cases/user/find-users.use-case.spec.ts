import { UserRepository } from '../../persistence/user/user.repository';
import { InMemoryPersistence } from '../../persistence/in-memory.persistence';
import { Role } from '../../entities/role.enum';
import { FindUsers } from './find-users.use-case';

describe('Find Users', () => {
  let userRepository: UserRepository;

  let findUsers: FindUsers;

  const admin = {
    email: 'admin@email.com',
    username: 'admin',
    password: 'admin',
    name: 'Admin McAdminface',
    roles: [Role.Admin],
  };

  const librarian = {
    email: 'librarian@email.net',
    username: 'librarian',
    password: 'librarian',
    roles: [Role.Librarian],
  };

  const member = {
    email: 'member@email.net',
    username: 'member',
    password: 'member',
    name: 'Member McMemberface',
  };

  beforeEach(async () => {
    userRepository = new UserRepository(new InMemoryPersistence());

    await Promise.all([admin, member, librarian].map(userRepository.save));

    findUsers = new FindUsers(userRepository);
  });

  it('finds all users for null query', async () => {
    const expectedResult = {
      total: 3,
      limit: 100,
      offset: 0,
      users: jasmine.arrayContaining([admin, librarian, member]),
    };

    await expect(findUsers.with(null)).resolves.toStrictEqual(expectedResult);
  });

  it('finds all users for empty query', async () => {
    const expectedResult = {
      total: 3,
      limit: 100,
      offset: 0,
      users: jasmine.arrayContaining([admin, librarian, member]),
    };

    await expect(findUsers.with({})).resolves.toStrictEqual(expectedResult);
  });

  it('applies limit and offset', async () => {
    const query = {
      offset: 1,
      limit: 1,
    };

    const expectedResult = {
      total: 3,
      limit: 1,
      offset: 1,
      users: jasmine.arrayContaining([member]),
    };

    await expect(findUsers.with(query)).resolves.toStrictEqual(expectedResult);
  });

  it('finds users with matching roles', async () => {
    const query = {
      roles: [Role.Admin],
    };

    const expectedResult = {
      total: 1,
      limit: 100,
      offset: 0,
      users: jasmine.arrayContaining([admin]),
    };

    await expect(findUsers.with(query)).resolves.toStrictEqual(expectedResult);
  });

  it('finds nothing if no users with all matching roles', async () => {
    const query = {
      roles: [Role.Admin, Role.Librarian],
    };

    const expectedResult = {
      total: 0,
      limit: 100,
      offset: 0,
      users: [],
    };

    await expect(findUsers.with(query)).resolves.toStrictEqual(expectedResult);
  });

  it('finds users with partially and case-insensitive matching emails', async () => {
    const query = {
      email: '.NET',
    };

    const expectedResult = {
      total: 2,
      limit: 100,
      offset: 0,
      users: jasmine.arrayContaining([member, librarian]),
    };

    await expect(findUsers.with(query)).resolves.toStrictEqual(expectedResult);
  });

  it('finds users with partially and case-insensitive matching username', async () => {
    const query = {
      username: 'lib',
    };

    const expectedResult = {
      total: 1,
      limit: 100,
      offset: 0,
      users: jasmine.arrayContaining([librarian]),
    };

    await expect(findUsers.with(query)).resolves.toStrictEqual(expectedResult);
  });

  it('finds users with partially and case-insensitive matching name', async () => {
    const query = {
      name: 'mc',
    };

    const expectedResult = {
      total: 2,
      limit: 100,
      offset: 0,
      users: jasmine.arrayContaining([admin, member]),
    };

    await expect(findUsers.with(query)).resolves.toStrictEqual(expectedResult);
  });
});
