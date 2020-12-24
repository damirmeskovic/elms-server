import { InMemoryRepository } from '../repositories/in-memory.repository';
import { FindUser } from './find-user.use-case';

describe('Fetch use case', () => {
  it('should be defined', () => {
    expect(new FindUser(new InMemoryRepository())).toBeDefined();
  });
});
