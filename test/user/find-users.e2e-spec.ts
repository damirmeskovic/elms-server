import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CredentialsDto } from '../../src/controllers/credentials.dto';
import { UserDto } from '../../src/controllers/user/user.dto';
import { UserRepository } from '../../src/persistence/user/user.repository';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { InMemoryPersistence } from '../../src/persistence/in-memory.persistence';
import { Role } from '../../src/entities/role.enum';

describe('/api/users', () => {
  let app: INestApplication;
  let userRepository: UserRepository;

  const admin = {
    email: 'admin@email.com',
    username: 'admin',
    name: 'Admin McAdminface',
    roles: [Role.Admin],
  };

  const librarian = {
    email: 'librarian@email.net',
    username: 'librarian',
    roles: [Role.Librarian],
  };

  const member = {
    email: 'member@email.net',
    username: 'member',
    name: 'Member McMemberface',
  };

  beforeEach(async () => {
    userRepository = new UserRepository(new InMemoryPersistence());

    await userRepository.save({ ...admin, password: admin.username });
    await userRepository.save({
      ...librarian,
      password: librarian.username,
    });
    await userRepository.save({ ...member, password: member.username });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserRepository)
      .useValue(userRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('User query is unauthorized if not logged in', () =>
    request(app.getHttpServer()).get('/api/users').expect(401));

  it('User query is forbidden if logged in as librarian', async () => {
    const loggedInUser = await login({
      username: librarian.username,
      password: librarian.username,
    });

    return request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(403);
  });

  it('User query is forbidden if logged in as member', async () => {
    const loggedInUser = await login({
      username: member.username,
      password: member.username,
    });

    return request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(403);
  });

  it('All users are returned with no query params', async () => {
    const loggedInUser = await login({
      username: admin.username,
      password: admin.username,
    });

    return request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(200, {
        total: 3,
        offset: 0,
        limit: 100,
        items: [admin, librarian, member],
      });
  });

  it('Limit and offset are applied', async () => {
    const loggedInUser = await login({
      username: admin.username,
      password: admin.username,
    });

    return request(app.getHttpServer())
      .get('/api/users')
      .query({
        offset: 1,
        limit: 1,
      })
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(200, {
        total: 3,
        offset: 1,
        limit: 1,
        items: [librarian],
      });
  });

  it('Roles are matched', async () => {
    const loggedInUser = await login({
      username: admin.username,
      password: admin.username,
    });

    return request(app.getHttpServer())
      .get('/api/users')
      .query({
        roles: ['Admin'],
      })
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(200, {
        total: 1,
        offset: 0,
        limit: 100,
        items: [admin],
      });
  });

  it('Email is matched partialy and case insensitive', async () => {
    const loggedInUser = await login({
      username: admin.username,
      password: admin.username,
    });

    return request(app.getHttpServer())
      .get('/api/users')
      .query({
        email: '.NET',
      })
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(200, {
        total: 2,
        offset: 0,
        limit: 100,
        items: [librarian, member],
      });
  });

  it('Username and name are matched partially and case insensitive', async () => {
    const loggedInUser = await login({
      username: admin.username,
      password: admin.username,
    });

    return request(app.getHttpServer())
      .get('/api/users')
      .query({
        username: 'N',
        name: 'MC',
      })
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(200, {
        total: 1,
        offset: 0,
        limit: 100,
        items: [admin],
      });
  });

  const login = async (credentials: CredentialsDto): Promise<UserDto> => {
    return request(app.getHttpServer())
      .post('/api/user/login')
      .send(credentials)
      .then((response) => response.body);
  };
});
