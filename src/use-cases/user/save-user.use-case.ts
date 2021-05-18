import { User } from 'src/entities/user.entity';
import { UserRepository } from './user.repository';

export class SaveUser {
  constructor(private readonly users: UserRepository) {}

  async user(user: User): Promise<User> {
    return await this.users.save(user);
  }
}
