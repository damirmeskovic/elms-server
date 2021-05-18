import { JwtTokenGenerator } from '../authentication/jwt-token.generator';
import { AuthenticateUser } from './user/authenticate-user.use-case';
import { CreateUser } from './user/create-user.use-case';
import { FindUser } from './user/find-user.use-case';
import { FindUsers } from './user/find-users.use-case';
import { GenerateToken } from './authentication/generate-token.use-case';
import { SaveUser } from './user/save-user.use-case';
import { TokenGenerator } from './authentication/token-generator.types';
import { UpdateUser } from './user/update-user.use-case';
import { UserRepository } from './user/user.repository';

const generateToken = {
  provide: GenerateToken,
  useFactory: (tokenGenerator: TokenGenerator) =>
    new GenerateToken(tokenGenerator),
  inject: [JwtTokenGenerator],
};

const findUser = {
  provide: FindUser,
  useFactory: (repository: UserRepository) => new FindUser(repository),
  inject: [UserRepository],
};

const save = {
  provide: SaveUser,
  useFactory: (repository: UserRepository) => new SaveUser(repository),
  inject: [UserRepository],
};

const authenticateUser = {
  provide: AuthenticateUser,
  useFactory: (findUser: FindUser) => new AuthenticateUser(findUser),
  inject: [FindUser],
};

const createUser = {
  provide: CreateUser,
  useFactory: (findUser: FindUser, save: SaveUser) =>
    new CreateUser(findUser, save),
  inject: [FindUser, SaveUser],
};

const updateUser = {
  provide: UpdateUser,
  useFactory: (findUser: FindUser, save: SaveUser) =>
    new UpdateUser(findUser, save),
  inject: [FindUser, SaveUser],
};

const findUsers = {
  provide: FindUsers,
  useFactory: (repository: UserRepository) => new FindUsers(repository),
  inject: [UserRepository],
};

export default [
  generateToken,
  findUser,
  save,
  authenticateUser,
  createUser,
  updateUser,
  findUsers,
];
