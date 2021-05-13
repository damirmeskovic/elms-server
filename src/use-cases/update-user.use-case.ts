import { Role } from 'src/entities/role.enum';
import { User } from 'src/entities/user.entity';
import { FindUser } from './find-user.use-case';
import { SaveUser } from './save-user.use-case';

export interface Request {
  username: string;
  email?: string;
  password?: string;
  roles?: Role[];
  name?: string;
  bio?: string;
}

export class UpdateUser {
  constructor(
    private readonly findUser: FindUser,
    private readonly save: SaveUser,
  ) {}

  async withProperties(request: Request): Promise<User> {
    if (!request.username) {
      throw new Error('Invalid request, username is missing!');
    }
    const user = await this.findUser.withUsername(request.username);

    if (!user) {
      throw new Error('Invalid request, unknown username!');
    }

    if (
      request.email &&
      request.email != user.email &&
      (await this.isEmailTaken(request.email))
    ) {
      throw new Error('Requested email is already used by another user!');
    }

    return await this.save.user({
      username: user.username,
      email: request.email || user.email,
      password: request.password || user.password,
      roles: request.roles || user.roles,
      name: request.name || user.name,
      bio: request.bio || user.bio,
    });
  }

  private async isEmailTaken(email: string): Promise<boolean> {
    const existingUser = await this.findUser.withEmail(email);
    return !!existingUser;
  }
}
