import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
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

  it('Create user request is unauthorized if not logged in', () => {
    return request(app.getHttpServer()).post('/api/user').expect(401);
  });

  it('Create user is successful if logged in', async () => {
    inMemoryRepository.users.save({
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
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
      bio: 'I am somebody!',
    };

    return request(app.getHttpServer())
      .post('/api/user')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .send(createUserDto)
      .expect(201, {
        email: createUserDto.email,
        username: createUserDto.username,
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
