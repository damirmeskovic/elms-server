import { JwtTokenGenerator } from './authentication/jwt-token.generator';
import { AuthenticateUser } from './use-cases/authenticate-user.use-case';
import { FindUser } from './use-cases/find-user.use-case';
import { GenerateToken } from './use-cases/generate-token.use-case';
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

const authenticateUser = {
  provide: AuthenticateUser,
  useFactory: (fetch: FindUser) => new AuthenticateUser(fetch),
  inject: [FindUser],
};

export default [generateToken, findUser, authenticateUser];
