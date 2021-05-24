import { AuthorRepository } from '../../persistence/author/author.repository';
import { InMemoryPersistence } from '../../persistence/in-memory.persistence';
import { FindAuthors } from './find-authors.use-case';
import { Author } from '../../entities/author.entity';

describe('Find Authors', () => {
  let authorRepository: AuthorRepository;

  let findAuthors: FindAuthors;

  const orwell: Author = {
    identifier: 'george-orwell',
    name: 'George Orwell',
    country: 'England',
    bio: 'Wrote during second world war.',
    tags: [
      {
        identifier: 'politics',
        name: 'Politics',
      },
      {
        identifier: 'mustache',
        name: 'Mustache',
      },
    ],
  };

  const mann: Author = {
    identifier: 'thomas-mann',
    name: 'Thomas Mann',
    country: 'Germany',
    bio: 'Another second world war period writer!',
    tags: [
      {
        identifier: 'mustache',
        name: 'Mustache',
      },
    ],
  };

  const cervantes: Author = {
    identifier: 'miguel-cervantes',
    name: 'Miguel Cervantes',
    country: 'Spain',
    bio: 'Wrote way back in the 17th century!',
    tags: [],
  };

  beforeEach(async () => {
    authorRepository = new AuthorRepository(new InMemoryPersistence());

    await Promise.all([orwell, mann, cervantes].map(authorRepository.save));

    findAuthors = new FindAuthors(authorRepository);
  });

  it('finds all authors for null query', async () => {
    const expectedResult = {
      total: 3,
      limit: 100,
      offset: 0,
      authors: jasmine.arrayContaining([orwell, mann, cervantes]),
    };

    await expect(findAuthors.with(null)).resolves.toStrictEqual(expectedResult);
  });

  it('finds all authors for empty query', async () => {
    const expectedResult = {
      total: 3,
      limit: 100,
      offset: 0,
      authors: jasmine.arrayContaining([mann, orwell, cervantes]),
    };

    await expect(findAuthors.with({})).resolves.toStrictEqual(expectedResult);
  });

  it('applies limit and offset', async () => {
    const query = {
      offset: 1,
      limit: 1,
    };

    const expectedResult = {
      total: 3,
      limit: 1,
      offset: 1,
      authors: jasmine.arrayContaining([orwell]),
    };

    await expect(findAuthors.with(query)).resolves.toStrictEqual(
      expectedResult,
    );
  });

  it('finds authors with partially and case-insensitive matching name', async () => {
    const query = {
      name: 'thom',
    };

    const expectedResult = {
      total: 1,
      limit: 100,
      offset: 0,
      authors: jasmine.arrayContaining([mann]),
    };

    await expect(findAuthors.with(query)).resolves.toStrictEqual(
      expectedResult,
    );
  });

  it('finds authors with partially and case-insensitive matching bio', async () => {
    const query = {
      bio: 'second world war',
    };

    const expectedResult = {
      total: 2,
      limit: 100,
      offset: 0,
      authors: jasmine.arrayContaining([mann]),
    };

    await expect(findAuthors.with(query)).resolves.toStrictEqual(
      expectedResult,
    );
  });

  it('finds authors with all matching tag identifiers', async () => {
    const query = {
      tagIdentifiers: ['mustache'],
    };

    const expectedResult = {
      total: 2,
      limit: 100,
      offset: 0,
      authors: jasmine.arrayContaining([orwell, mann]),
    };

    await expect(findAuthors.with(query)).resolves.toStrictEqual(
      expectedResult,
    );
  });
});
