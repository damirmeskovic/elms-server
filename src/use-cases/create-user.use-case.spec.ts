import { InMemoryRepository } from '../repositories/in-memory.repository';
import { CreateUser, Request } from './create-user.use-case';
import { FindUser } from './find-user.use-case';
import { Save } from './save.use-case';
import { Repository } from './types/repository.types';

describe('Create User', () => {
  let inMemoryRepository: Repository;
  let findUser: FindUser;
  let save: Save;

  let createUser: CreateUser;

  beforeEach(async () => {
    inMemoryRepository = new InMemoryRepository();
    findUser = new FindUser(inMemoryRepository);
    save = new Save(inMemoryRepository);

    createUser = new CreateUser(findUser, save);
  });

  it('returns null if email is missing', async () => {
    const createdUser = await createUser.withProperties({
      email: null,
      username: 'username',
      password: 'something',
    });

    expect(createdUser).toBeNull();
  });

  it('returns null if username is missing', async () => {
    const createdUser = await createUser.withProperties({
      email: 'some@email.com',
      username: '',
      password: 'something',
    });

    expect(createdUser).toBeNull();
  });

  it('returns null if password is missing', async () => {
    const createdUser = await createUser.withProperties({
      email: 'some@email.com',
      username: 'username',
      password: undefined,
    });

    expect(createdUser).toBeNull();
  });

  it('throws if username is taken', async () => {
    await expect(() =>
      createUser.withProperties({
        email: 'some@email.com',
        username: 'admin',
        password: 'passsword',
      }),
    ).rejects.toThrow('User with requested username already exists!');
  });

  it('throws if user with requested email already exists', async () => {
    await expect(() =>
      createUser.withProperties({
        email: 'admin@email.com',
        username: 'username',
        password: 'passsword',
      }),
    ).rejects.toThrow('User with requested email already exists!');
  });

  it('saves and returns the user with requested properties', async () => {
    const request: Request = {
      email: 'some@email.com',
      username: 'someone',
      password: 'somePass',
      name: 'Someone McSomeoneface',
      bio: 'I am somebody!',
    };

    const createdUser = await createUser.withProperties(request);
    const savedUser = await findUser.withUsername(request.username);

    expect(savedUser).toEqual(createdUser);
  });
});
