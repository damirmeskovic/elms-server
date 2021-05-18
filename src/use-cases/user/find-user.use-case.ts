import { User } from 'src/entities/user.entity';
import { UserRepository } from './user.repository';

export class FindUser {
  constructor(private readonly users: UserRepository) {}

  async withUsername(username: string): Promise<User> {
    return await this.users.find(username);
  }

  async withEmail(email: string): Promise<User> {
    return await this.users.findByEmail(email);
  }
}
