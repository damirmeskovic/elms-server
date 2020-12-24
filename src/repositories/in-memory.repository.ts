import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Repository } from 'src/use-cases/types/repository.types';

@Injectable()
export class InMemoryRepository implements Repository {
  private readonly userCollection: User[] = [
    {
      email: 'admin@email.com',
      username: 'admin',
      password: 'admin',
      bio: 'I am the administrator!',
    },
  ];

  readonly users = {
    find: async (username: string): Promise<User> =>
      this.userCollection.find((user) => user.username === username),

    save: (user: User) => this.userCollection.push(user),
  };
}