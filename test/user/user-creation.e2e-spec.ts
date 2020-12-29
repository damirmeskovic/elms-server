import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../src/entities/role.enum';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CredentialsDto } from '../../src/controllers/types/credentials.dto';
import { UserDto } from '../../src/controllers/types/user.dto';
import { InMemoryRepository } from '../../src/repositories/in-memory.repository';
import { Repository } from '../../src/use-cases/types/repository.types';

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

  it('Create user is unauthorized if not logged in', () => {
    return request(app.getHttpServer()).post('/api/user').expect(401);
  });

  it('Create user is forbidden if logged in as librarian', async () => {
    inMemoryRepository.users.save({
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
      .post('/api/user')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(403);
  });

  it('Create user is forbidden if logged in as member', async () => {
    inMemoryRepository.users.save({
      email: 'member@email.com',
      username: 'member',
      password: 'member',
    });

    const loggedInUser = await login({
      username: 'member',
      password: 'member',
    });

    return request(app.getHttpServer())
      .post('/api/user')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .expect(403);
  });

  it('Create user is successful if logged in as admin', async () => {
    inMemoryRepository.users.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      roles: [Role.Admin],
    });

    const loggedInUser = await login({
      username: 'admin',
      password: 'admin',
    });

    const createUserDto = {
      email: 'someone@email.com',
      username: 'someone',
      password: 'somepass',
      name: 'Some One',
      roles: [Role.Librarian],
      bio: 'I am somebody!',
    };

    return request(app.getHttpServer())
      .post('/api/user')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .send(createUserDto)
      .expect(201, {
        email: createUserDto.email,
        username: createUserDto.username,
        roles: createUserDto.roles,
        name: createUserDto.name,
        bio: createUserDto.bio,
      });
  });

  const login = async (credentials: CredentialsDto): Promise<UserDto> => {
    return request(app.getHttpServer())
      .post('/api/user/login')
      .send(credentials)
      .then((response) => response.body);
  };
});
