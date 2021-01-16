import { Role } from '../entities/role.enum';
import { InMemoryRepository } from '../repositories/in-memory.repository';
import { FindUser } from './find-user.use-case';
import { Save } from './save.use-case';
import { Repository } from './types/repository.types';
import { Request, UpdateUser } from './update-user.use-case';

describe('Update User', () => {
  let inMemoryRepository: Repository;
  let findUser: FindUser;
  let save: Save;

  let updateUser: UpdateUser;

  beforeEach(async () => {
    inMemoryRepository = new InMemoryRepository();
    findUser = new FindUser(inMemoryRepository);
    save = new Save(inMemoryRepository);

    updateUser = new UpdateUser(findUser, save);
  });

  it('throws if username is missing', async () => {
    await expect(() =>
      updateUser.withProperties({
        username: null,
      }),
    ).rejects.toThrow('Invalid request, username is missing!');
  });

  it('throws if requested with unknown username', async () => {
    await expect(() =>
      updateUser.withProperties({
        username: 'something',
      }),
    ).rejects.toThrow('Invalid request, unknown username!');
  });

  it('throws if user with requested email already exists', async () => {
    inMemoryRepository.users.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
    });

    inMemoryRepository.users.save({
      email: 'member@email.com',
      username: 'member',
      password: 'member',
    });

    await expect(() =>
      updateUser.withProperties({
        username: 'member',
        email: 'admin@email.com',
      }),
    ).rejects.toThrow('Requested email is already used by another user!');
  });

  it('saves and returns the updated user', async () => {
    inMemoryRepository.users.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      roles: [Role.Admin],
      name: 'Admin McAdminface',
      bio: 'I am an Administrator!',
    });

    const request: Request = {
      username: 'admin',
      email: 'email@nimda.com',
      password: 'nimda',
      roles: [Role.Librarian],
      name: 'Nimda McNimdaface',
      bio: 'I am now a Rotartsinimda!',
    };

    const updatedUser = await updateUser.withProperties(request);
    const savedUser = await findUser.withUsername(request.username);

    expect(updatedUser).toEqual({ ...request });
    expect(savedUser).toEqual(updatedUser);
  });
});
