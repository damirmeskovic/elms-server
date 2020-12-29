import { LocalJsonRepository } from './repositories/local-json.repository';
import { Repository } from './use-cases/types/repository.types';

const repository = {
  provide: Repository,
  useFactory: () => new LocalJsonRepository(),
};

export default [repository];
