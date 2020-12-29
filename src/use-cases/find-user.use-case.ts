import { User } from 'src/entities/user.entity';
import { Repository } from './types/repository.types';

export class FindUser {
  constructor(private readonly repository: Repository) {}

  async withUsername(username: string): Promise<User> {
    return await this.repository.users.find(username);
  }

  async withEmail(email: string): Promise<User> {
    return await this.repository.users.findByEmail(email);
  }
}
