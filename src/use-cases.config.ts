import { JwtTokenGenerator } from './authentication/jwt-token.generator';
import { AuthenticateUser } from './use-cases/authenticate-user.use-case';
import { CreateUser } from './use-cases/create-user.use-case';
import { FindUser } from './use-cases/find-user.use-case';
import { FindUsers } from './use-cases/find-users.use-case';
import { GenerateToken } from './use-cases/generate-token.use-case';
import { SaveUser } from './use-cases/save-user.use-case';
import { TokenGenerator } from './use-cases/types/token-generator.types';
import { UpdateUser } from './use-cases/update-user.use-case';
import { UserRepository } from './use-cases/types/repository.types';

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
