import { User } from 'src/entities/user.entity';

export interface UserRepository {
  save(item: User);
  find(username: string): Promise<User>;
}

export class Repository {
  readonly users: UserRepository;
}
