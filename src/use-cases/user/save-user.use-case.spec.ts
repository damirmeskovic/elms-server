import { UserRepository } from '../../persistence/user/user.repository';
import { InMemoryPersistence } from '../../persistence/in-memory.persistence';
import { Role } from '../../entities/role.enum';
import { FindUsers } from './find-users.use-case';
import { SaveUser } from './save-user.use-case';

describe('Save User', () => {
  let userRepository: UserRepository;

  let saveUser: SaveUser;

  beforeEach(async () => {
    userRepository = new UserRepository(new InMemoryPersistence());

    saveUser = new SaveUser(userRepository);
  });

  it('throws for null user', () =>
    expect(saveUser.user(null)).rejects.toThrow('Cannot save null user!'));

  it('saves a new user', async () => {
    const librarian = {
      email: 'librarian@email.com',
      username: 'librarian',
      password: 'librarian',
      roles: [Role.Librarian],
    };

    await expect(saveUser.user(librarian)).resolves.toStrictEqual(librarian);
  });

  it('saves a new version of an existing user', async () => {
    const librarian = {
      email: 'librarian@email.com',
      username: 'librarian',
      password: 'librarian',
      roles: [Role.Librarian],
    };

    userRepository.save(librarian);

    const updatedLibrarian = {
      ...librarian,
      password: 'updatedPassword',
      roles: [Role.Admin, Role.Librarian],
    };

    await expect(saveUser.user(updatedLibrarian)).resolves.toStrictEqual(
      updatedLibrarian,
    );
  });
});
