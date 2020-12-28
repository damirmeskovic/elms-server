import { Injectable } from '@nestjs/common';
import { async } from 'rxjs';
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
    save: (user: User) => this.userCollection.push(user),

    find: async (username: string): Promise<User> =>
      this.userCollection.find((user) => user.username === username),

    findByEmail: async (email: string): Promise<User> =>
      this.userCollection.find((user) => user.email === email),
  };
}
