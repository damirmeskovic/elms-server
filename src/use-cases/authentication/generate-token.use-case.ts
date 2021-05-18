import { User } from '../../entities/user.entity';
import { TokenGenerator } from './token-generator.types';

export class GenerateToken {
  constructor(private readonly tokenGenerator: TokenGenerator) {}

  async forUser(user: User): Promise<string> {
    const token = await this.tokenGenerator.next({
      sub: user.username,
    });

    return token;
  }
}
