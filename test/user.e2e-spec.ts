import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CredentialsDto } from '../src/controllers/types/credentials.dto';
import { UserDto } from '../src/controllers/types/user.dto';
import { Repository } from '../src/use-cases/types/repository.types';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { InMemoryRepository } from '../src/repositories/in-memory.repository';

describe('/api/user', () => {
  let app: INestApplication;
  let inMemoryRepository: Repository;

  beforeEach(async () => {
    inMemoryRepository = new InMemoryRepository();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(Repository)
      .useValue(inMemoryRepository)
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

  it('Login with incorrect credentials is unauthorized', () => {
    inMemoryRepository.users.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      name: 'Admin McAdminface',
      bio: 'I am the administrator!',
    });

    return request(app.getHttpServer())
      .post('/api/user/login')
      .send({
        username: 'admin',
        password: 'incorrectPassword',
      })
      .expect(401);
  });

  it('Logged in user is returned for correct credentials', () => {
    inMemoryRepository.users.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
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
        expect(body.name).toEqual('Admin McAdminface');
        expect(body.bio).toEqual('I am the administrator!');
      });
  });

  it('Current user request is unautorhized if not logged in', () => {
    return request(app.getHttpServer()).get('/api/user/').expect(401);
  });

  it('Current user is returned if logged in', async () => {
    inMemoryRepository.users.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      name: 'Admin McAdminface',
      bio: 'I am the administrator!',
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
