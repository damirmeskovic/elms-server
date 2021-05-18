import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticateUser } from '../use-cases/user/authenticate-user.use-case';
import { GenerateToken } from '../use-cases/authentication/generate-token.use-case';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy, 'login') {
  constructor(
    private readonly authenticateUser: AuthenticateUser,
    private readonly generateToken: GenerateToken,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authenticateUser.withCredentials({
      username,
      password,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = await this.generateToken.forUser(user);
    if (!token) {
      throw new UnauthorizedException();
    }
    return {
      token,
      user,
    };
  }
}
