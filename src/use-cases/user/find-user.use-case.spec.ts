import { FindUser } from './find-user.use-case';
import { UserRepository } from '../../persistence/user/user.repository';
import { InMemoryPersistence } from '../../persistence/in-memory.persistence';
import { Role } from '../../entities/role.enum';

describe('Find User', () => {
  let userRepository: UserRepository;

  let findUser: FindUser;

  const admin = {
    email: 'admin@email.com',
    username: 'admin',
    password: 'admin',
    name: 'Admin McAdminface',
    roles: [Role.Admin],
  };

  beforeEach(async () => {
    userRepository = new UserRepository(new InMemoryPersistence());
    await userRepository.save({ ...admin });

    findUser = new FindUser(userRepository);
  });

  it('finds nothing for unknown username', async () => {
    await expect(findUser.withUsername('something')).resolves.toBeNull();
  });

  it('finds nothing for partial username', async () => {
    await expect(findUser.withUsername('admi')).resolves.toBeNull();
  });

  it('finds existing user for exact username', async () => {
    await expect(findUser.withUsername(admin.username)).resolves.toStrictEqual(
      admin,
    );
  });

  it('finds nothing for unknown email', async () => {
    await expect(findUser.withUsername('some@email.com')).resolves.toBeNull();
  });

  it('finds nothing for partial email', async () => {
    await expect(findUser.withUsername('admin@email')).resolves.toBeNull();
  });

  it('finds existing user for exact email', async () => {
    await expect(findUser.withEmail(admin.email)).resolves.toStrictEqual(admin);
  });
});
