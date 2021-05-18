import { InMemoryPersistence } from '../../persistence/in-memory.persistence';
import { FindUser } from './find-user.use-case';
import { AuthenticateUser } from './authenticate-user.use-case';
import { UserRepository } from '../../persistence/user/user.repository';

describe('Authenticate User', () => {
  let userRepository: UserRepository;
  let findUser: FindUser;

  let authenticateUser: AuthenticateUser;

  beforeEach(async () => {
    userRepository = new UserRepository(new InMemoryPersistence());
    findUser = new FindUser(userRepository);

    authenticateUser = new AuthenticateUser(findUser);
  });

  it('returns null for null username', async () => {
    const user = await authenticateUser.withCredentials({
      username: null,
      password: 'something',
    });

    expect(user).toBeNull();
  });

  it('returns null for null password', async () => {
    const user = await authenticateUser.withCredentials({
      username: 'username',
      password: null,
    });

    expect(user).toBeNull();
  });

  it('returns null for unknown user', async () => {
    const user = await authenticateUser.withCredentials({
      username: 'unknown',
      password: 'something',
    });

    expect(user).toBeNull();
  });

  it('returns null for incorrect password', async () => {
    const existingUser = {
      email: 'someone@email.com',
      username: 'someone',
      password: 'correctPassword',
    };

    await userRepository.save(existingUser);

    const user = await authenticateUser.withCredentials({
      username: 'damir',
      password: 'wrongPassword',
    });

    expect(user).toBeNull();
  });

  it('returns existing user for correct credentials', async () => {
    const existingUser = {
      email: 'damir@email.com',
      username: 'damir',
      password: 'correctPassword',
    };

    await userRepository.save(existingUser);

    const user = await authenticateUser.withCredentials({
      username: existingUser.username,
      password: existingUser.password,
    });

    expect(user).toEqual(existingUser);
  });
});
