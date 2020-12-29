import { InMemoryRepository } from '../repositories/in-memory.repository';
import { FindUser } from './find-user.use-case';
import { Repository } from './types/repository.types';
import { AuthenticateUser } from './authenticate-user.use-case';

describe('Authenticate User', () => {
  let inMemoryRepository: Repository;
  let findUser: FindUser;

  let authenticateUser: AuthenticateUser;

  beforeEach(async () => {
    inMemoryRepository = new InMemoryRepository();
    findUser = new FindUser(inMemoryRepository);

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

  it('returns null for incorect password', async () => {
    const existingUser = {
      email: 'someone@email.com',
      username: 'someone',
      password: 'correctPassword',
    };

    inMemoryRepository.users.save(existingUser);

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

    inMemoryRepository.users.save(existingUser);

    const user = await authenticateUser.withCredentials({
      username: existingUser.username,
      password: existingUser.password,
    });

    expect(user).toEqual(existingUser);
  });
});
