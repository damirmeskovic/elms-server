import { Role } from 'src/entities/role.enum';
import { User } from 'src/entities/user.entity';
import { FindUser } from './find-user.use-case';
import { SaveUser } from './save-user.use-case';

export interface Request {
  email: string;
  username: string;
  password: string;
  roles?: Role[];
  name?: string;
  bio?: string;
}

export class CreateUser {
  constructor(
    private readonly findUser: FindUser,
    private readonly save: SaveUser,
  ) {}

  async withProperties(request: Request): Promise<User> {
    if (!request.email || !request.username || !request.password) {
      throw new Error('Invalid request, required fields missing!');
    }

    if (await this.isUsernameTaken(request.username)) {
      throw new Error('User with requested username already exists!');
    }

    if (await this.isEmailTaken(request.email)) {
      throw new Error('User with requested email already exists!');
    }

    return await this.save.user({ ...request });
  }

  private async isUsernameTaken(username: string): Promise<boolean> {
    const existingUser = await this.findUser.withUsername(username);
    return !!existingUser;
  }

  private async isEmailTaken(email: string): Promise<boolean> {
    const existingUser = await this.findUser.withEmail(email);
    return !!existingUser;
  }
}
