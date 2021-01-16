import { Role } from '../entities/role.enum';
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

  it('throws if email is missing', async () => {
    await expect(() =>
      createUser.withProperties({
        email: null,
        username: 'username',
        password: 'something',
      }),
    ).rejects.toThrow('Invalid request, required fields missing!');
  });

  it('throws if username is missing', async () => {
    await expect(() =>
      createUser.withProperties({
        email: 'some@email.com',
        username: '',
        password: 'something',
      }),
    ).rejects.toThrow('Invalid request, required fields missing!');
  });

  it('throws if password is missing', async () => {
    await expect(() =>
      createUser.withProperties({
        email: 'some@email.com',
        username: 'username',
        password: undefined,
      }),
    ).rejects.toThrow('Invalid request, required fields missing!');
  });

  it('throws if username is taken', async () => {
    inMemoryRepository.users.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
    });

    await expect(() =>
      createUser.withProperties({
        email: 'some@email.com',
        username: 'admin',
        password: 'passsword',
      }),
    ).rejects.toThrow('User with requested username already exists!');
  });

  it('throws if user with requested email already exists', async () => {
    inMemoryRepository.users.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
    });

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
      roles: [Role.Admin, Role.Librarian],
      name: 'Someone McSomeoneface',
      bio: 'I am somebody!',
    };

    const createdUser = await createUser.withProperties(request);
    const savedUser = await findUser.withUsername(request.username);

    expect(savedUser).toEqual(createdUser);
  });
});
