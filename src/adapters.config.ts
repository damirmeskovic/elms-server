import { InMemoryRepository } from './repositories/in-memory.repository';
import { Repository } from './use-cases/types/repository.types';

const repository = {
  provide: Repository,
  useFactory: () => new InMemoryRepository(),
};

export default [repository];
