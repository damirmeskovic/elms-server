import { create } from 'domain';
import { InMemoryRepository } from '../repositories/in-memory.repository';
import { CreateUser } from './create-user.use-case';
import { FindUser } from './find-user.use-case';
import { SaveUser } from './save-user.use-case';
import { Repository } from './types/repository.types';

describe('Create User', () => {
  let inMemoryRepository: Repository;
  let findUser: FindUser;
  let saveUser: SaveUser;

  let createUser: CreateUser;

  beforeEach(async () => {
    inMemoryRepository = new InMemoryRepository();
    findUser = new FindUser(inMemoryRepository);
    saveUser = new SaveUser(inMemoryRepository);

    createUser = new CreateUser(findUser, saveUser);
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
});
