import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CredentialsDto } from '../../src/controllers/credentials.dto';
import { UserDto } from '../../src/controllers/user/user.dto';
import { UserRepository } from '../../src/persistence/user/user.repository';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { InMemoryPersistence } from '../../src/persistence/in-memory.persistence';
import { Role } from '../../src/entities/role.enum';

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

  it('Empty login request is unauthorized', () => {
    return request(app.getHttpServer())
      .post('/api/user/login')
      .send({})
      .expect(401);
  });

  it('Login of unknown user is unauthorized', () => {
    return request(app.getHttpServer())
      .post('/api/user/login')
      .send({
        username: 'someuser',
        password: 'somePassword',
      })
      .expect(401);
  });

  it('Login with incorrect credentials is unauthorized', async () => {
    await userRepository.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      roles: [Role.Admin],
    });

    return request(app.getHttpServer())
      .post('/api/user/login')
      .send({
        username: 'admin',
        password: 'incorrectPassword',
      })
      .expect(401);
  });

  it('Logged in user is returned for correct credentials', async () => {
    await userRepository.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      roles: [Role.Admin],
      name: 'Admin McAdminface',
      bio: 'I am the administrator!',
    });

    return request(app.getHttpServer())
      .post('/api/user/login')
      .send({
        username: 'admin',
        password: 'admin',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.token).not.toBeUndefined();
        expect(body.token.length).toBeGreaterThan(0);
        expect(body.username).toEqual('admin');
        expect(body.email).toEqual('admin@email.com');
        expect(body.roles).toEqual(['Admin']);
        expect(body.name).toEqual('Admin McAdminface');
        expect(body.bio).toEqual('I am the administrator!');
      });
  });

  it('Current user request is unautorhized if not logged in', () => {
    return request(app.getHttpServer()).get('/api/user/').expect(401);
  });

  it('Current user is returned if logged in', async () => {
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

    return request(app.getHttpServer())
      .get('/api/user')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(200, loggedInUser);
  });

  const login = async (credentials: CredentialsDto): Promise<UserDto> => {
    return request(app.getHttpServer())
      .post('/api/user/login')
      .send(credentials)
      .then((response) => response.body);
  };
});
