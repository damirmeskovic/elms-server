import { Role } from '../../entities/role.enum';
import { InMemoryPersistence } from '../../persistence/in-memory.persistence';
import { CreateUser, Request } from './create-user.use-case';
import { FindUser } from './find-user.use-case';
import { SaveUser } from './save-user.use-case';
import { UserRepository } from '../../persistence/user/user.repository';

describe('Create User', () => {
  let userRepository: UserRepository;
  let findUser: FindUser;
  let saveUser: SaveUser;

  let createUser: CreateUser;

  beforeEach(async () => {
    userRepository = new UserRepository(new InMemoryPersistence());
    findUser = new FindUser(userRepository);
    saveUser = new SaveUser(userRepository);

    createUser = new CreateUser(findUser, saveUser);
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
    await userRepository.save({
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
    await userRepository.save({
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
