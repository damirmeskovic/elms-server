import { TagRepository } from '../../persistence/tag/tag.repository';
import { InMemoryPersistence } from '../../persistence/in-memory.persistence';
import { FindTags } from './find-tags.use-case';
import { Tag } from '../../entities/tag.entity';

describe('Find Tags', () => {
  let tagRepository: TagRepository;

  let findTags: FindTags;

  const blue: Tag = {
    identifier: 'blue',
    name: 'Blue',
    description: 'Everything related to the color blue!',
  };

  const happy: Tag = {
    identifier: 'happy',
    name: 'Happy Tag',
    description: 'The happy tag related stuff!',
  };

  beforeEach(async () => {
    tagRepository = new TagRepository(new InMemoryPersistence());

    await Promise.all([blue, happy].map(tagRepository.save));

    findTags = new FindTags(tagRepository);
  });

  it('finds all tags for null query', async () => {
    const expectedResult = {
      total: 2,
      limit: 100,
      offset: 0,
      tags: jasmine.arrayContaining([blue, happy]),
    };

    await expect(findTags.with(null)).resolves.toStrictEqual(expectedResult);
  });

  it('finds all tags for empty query', async () => {
    const expectedResult = {
      total: 2,
      limit: 100,
      offset: 0,
      tags: jasmine.arrayContaining([happy, blue]),
    };

    await expect(findTags.with({})).resolves.toStrictEqual(expectedResult);
  });

  it('applies limit and offset', async () => {
    const query = {
      offset: 1,
      limit: 1,
    };

    const expectedResult = {
      total: 2,
      limit: 1,
      offset: 1,
      tags: jasmine.arrayContaining([happy]),
    };

    await expect(findTags.with(query)).resolves.toStrictEqual(expectedResult);
  });

  it('finds tags with partially and case-insensitive matching name', async () => {
    const query = {
      name: 'happy',
    };

    const expectedResult = {
      total: 1,
      limit: 100,
      offset: 0,
      tags: jasmine.arrayContaining([happy]),
    };

    await expect(findTags.with(query)).resolves.toStrictEqual(expectedResult);
  });

  it('finds tags with partially and case-insensitive matching description', async () => {
    const query = {
      description: 'related',
    };

    const expectedResult = {
      total: 2,
      limit: 100,
      offset: 0,
      tags: jasmine.arrayContaining([happy]),
    };

    await expect(findTags.with(query)).resolves.toStrictEqual(expectedResult);
  });
});
