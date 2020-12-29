import { JwtTokenGenerator } from './authentication/jwt-token.generator';
import { AuthenticateUser } from './use-cases/authenticate-user.use-case';
import { CreateUser } from './use-cases/create-user.use-case';
import { FindUser } from './use-cases/find-user.use-case';
import { GenerateToken } from './use-cases/generate-token.use-case';
import { Save } from './use-cases/save.use-case';
import { Repository } from './use-cases/types/repository.types';
import { TokenGenerator } from './use-cases/types/token-generator.types';

const generateToken = {
  provide: GenerateToken,
  useFactory: (tokenGenerator: TokenGenerator) =>
    new GenerateToken(tokenGenerator),
  inject: [JwtTokenGenerator],
};

const findUser = {
  provide: FindUser,
  useFactory: (repository: Repository) => new FindUser(repository),
  inject: [Repository],
};

const save = {
  provide: Save,
  useFactory: (repository: Repository) => new Save(repository),
  inject: [Repository],
};

const authenticateUser = {
  provide: AuthenticateUser,
  useFactory: (findUser: FindUser) => new AuthenticateUser(findUser),
  inject: [FindUser],
};

const createUser = {
  provide: CreateUser,
  useFactory: (findUser: FindUser, save: Save) =>
    new CreateUser(findUser, save),
  inject: [FindUser, Save],
};

export default [generateToken, findUser, save, authenticateUser, createUser];
