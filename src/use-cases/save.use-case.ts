import { User } from 'src/entities/user.entity';
import { Repository } from './types/repository.types';

export class Save {
  constructor(private readonly repository: Repository) {}

  async user(user: User): Promise<User> {
    return await this.repository.users.save(user);
  }
}
