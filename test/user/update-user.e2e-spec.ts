import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../src/entities/role.enum';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CredentialsDto } from '../../src/controllers/credentials.dto';
import { UserDto } from '../../src/controllers/user/user.dto';
import { InMemoryPersistence } from '../../src/persistence/in-memory.persistence';
import { UserRepository } from '../../src/persistence/user/user.repository';

describe('/api/user', () => {
  let app: INestApplication;
  let userRepository: UserRepository;

  beforeEach(async () => {
    userRepository = new UserRepository(new InMemoryPersistence());

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserRepository)
      .useValue(userRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('Update user is unauthorized if not logged in', () => {
    return request(app.getHttpServer()).put('/api/user/admin').expect(401);
  });

  it('Update user is forbidden if logged in as librarian', async () => {
    await userRepository.save({
      email: 'librarian@email.com',
      username: 'librarian',
      password: 'librarian',
      roles: [Role.Librarian],
    });

    const loggedInUser = await login({
      username: 'librarian',
      password: 'librarian',
    });

    return request(app.getHttpServer())
      .put('/api/user/admin')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(403);
  });

  it('Create user is forbidden if logged in as member', async () => {
    await userRepository.save({
      email: 'member@email.com',
      username: 'member',
      password: 'member',
    });

    const loggedInUser = await login({
      username: 'member',
      password: 'member',
    });

    return request(app.getHttpServer())
      .put('/api/user/admin')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(403);
  });

  it('Update user is successful if logged in as admin', async () => {
    await userRepository.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      roles: [Role.Admin],
    });

    await userRepository.save({
      username: 'member',
      email: 'member@email.com',
      password: 'member',
      name: 'Member McMemberface',
      bio: 'I am a member!',
    });

    const loggedInUser = await login({
      username: 'admin',
      password: 'admin',
    });

    const updateUserDto = {
      email: 'email@member.com',
      password: 'changedPass',
      name: 'Rebmem McRebmemface',
      roles: [Role.Librarian],
      bio: 'I am a Librarian now!',
    };

    return request(app.getHttpServer())
      .put('/api/user/member')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .send(updateUserDto)
      .expect(200, {
        email: updateUserDto.email,
        username: 'member',
        roles: updateUserDto.roles,
        name: updateUserDto.name,
        bio: updateUserDto.bio,
      });
  });

  it('Update fails for non existing users', async () => {
    await userRepository.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      roles: [Role.Admin],
    });

    const loggedInUser = await login({
      username: 'admin',
      password: 'admin',
    });

    const updateUserDto = {
      email: 'email@member.com',
      password: 'changedPass',
      name: 'Rebmem McRebmemface',
      roles: [Role.Librarian],
      bio: 'I am a Librarian now!',
    };

    return request(app.getHttpServer())
      .put('/api/user/member')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .send(updateUserDto)
      .expect(400);
  });

  it('Update fails if email is already used by another user', async () => {
    await userRepository.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      roles: [Role.Admin],
    });

    await userRepository.save({
      username: 'member',
      email: 'member@email.com',
      password: 'member',
      name: 'Member McMemberface',
      bio: 'I am a member!',
    });

    const loggedInUser = await login({
      username: 'admin',
      password: 'admin',
    });

    const updateUserDto = {
      email: 'admin@email.com',
      password: 'changedPass',
      name: 'Rebmem McRebmemface',
      roles: [Role.Librarian],
      bio: 'I am a Librarian now!',
    };

    return request(app.getHttpServer())
      .put('/api/user/member')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .send(updateUserDto)
      .expect(400);
  });

  const login = async (credentials: CredentialsDto): Promise<UserDto> => {
    return request(app.getHttpServer())
      .post('/api/user/login')
      .send(credentials)
      .then((response) => response.body);
  };
});
