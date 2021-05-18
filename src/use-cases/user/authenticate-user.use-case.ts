import { User } from '../../entities/user.entity';
import { FindUser } from './find-user.use-case';

export interface Credentials {
  readonly username: string;
  readonly password: string;
}

export class AuthenticateUser {
  constructor(private readonly findUser: FindUser) {}

  async withCredentials(request: Credentials): Promise<User> {
    const user = await this.findUser.withUsername(request.username);
    if (user && user.password === request.password) {
      return user;
    }
    return null;
  }
}
