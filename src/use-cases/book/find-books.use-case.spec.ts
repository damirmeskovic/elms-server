import { BookRepository } from '../../persistence/book/book.repository';
import { InMemoryPersistence } from '../../persistence/in-memory.persistence';
import { FindBooks } from './find-books.use-case';
import { Book } from '../../entities/book.entity';
import { Author } from '../../entities/author.entity';

describe('Find Books', () => {
  let bookRepository: BookRepository;

  let findBooks: FindBooks;

  const politics = {
    identifier: 'politics',
    name: 'Politics',
  };

  const mustache = {
    identifier: 'mustache',
    name: 'Mustache',
  };

  const satire = {
    identifier: 'satire',
    name: 'Satire',
  };

  const love = {
    identifier: 'love',
    name: 'Love',
  };

  const orwell: Author = {
    identifier: 'george-orwell',
    name: 'George Orwell',
    country: 'England',
    bio: 'Wrote during second world war.',
    tags: [politics, mustache],
  };

  const mann: Author = {
    identifier: 'thomas-mann',
    name: 'Thomas Mann',
    country: 'Germany',
    bio: 'Another second world war period writer!',
    tags: [mustache],
  };

  const animalFarm: Book = {
    identifier: 'animal-farm',
    title: 'Animal Farm',
    description: 'A funny book about animals.',
    authors: [orwell],
    tags: [satire, politics],
  };

  const magicMountain: Book = {
    identifier: 'magic-mountain',
    title: 'Magic Mountain',
    description: 'Happens in a Swiss sanatorium.',
    authors: [mann],
    tags: [politics, love],
  };

  const magicFarm: Book = {
    identifier: 'magic-farm',
    title: 'Magic Farm',
    description: 'If they wrote a book together...',
    authors: [mann, orwell],
    tags: [politics, love, satire],
  };

  beforeEach(async () => {
    bookRepository = new BookRepository(new InMemoryPersistence());

    await Promise.all(
      [magicMountain, animalFarm, magicFarm].map(bookRepository.save),
    );

    findBooks = new FindBooks(bookRepository);
  });

  it('finds all books for null query', async () => {
    const expectedResult = {
      total: 3,
      limit: 100,
      offset: 0,
      books: jasmine.arrayContaining([animalFarm, magicMountain, magicFarm]),
    };

    await expect(findBooks.with(null)).resolves.toStrictEqual(expectedResult);
  });

  it('finds all books for empty query', async () => {
    const expectedResult = {
      total: 3,
      limit: 100,
      offset: 0,
      books: jasmine.arrayContaining([magicMountain, animalFarm, magicFarm]),
    };

    await expect(findBooks.with({})).resolves.toStrictEqual(expectedResult);
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
      books: jasmine.arrayContaining([animalFarm]),
    };

    await expect(findBooks.with(query)).resolves.toStrictEqual(expectedResult);
  });

  it('finds books with partially and case-insensitive matching title', async () => {
    const query = {
      title: 'magic',
    };

    const expectedResult = {
      total: 2,
      limit: 100,
      offset: 0,
      books: jasmine.arrayContaining([magicFarm, magicMountain]),
    };

    await expect(findBooks.with(query)).resolves.toStrictEqual(expectedResult);
  });

  it('finds books with partially and case-insensitive matching desciption', async () => {
    const query = {
      description: 'BOOK',
    };

    const expectedResult = {
      total: 2,
      limit: 100,
      offset: 0,
      books: jasmine.arrayContaining([animalFarm, magicFarm]),
    };

    await expect(findBooks.with(query)).resolves.toStrictEqual(expectedResult);
  });

  it('finds books with all matching tag identifiers', async () => {
    const query = {
      tagIdentifiers: ['politics', 'satire', 'love'],
    };

    const expectedResult = {
      total: 1,
      limit: 100,
      offset: 0,
      books: jasmine.arrayContaining([magicFarm]),
    };

    await expect(findBooks.with(query)).resolves.toStrictEqual(expectedResult);
  });

  it('finds books with all matching author identifiers', async () => {
    const query = {
      authorIdentifiers: ['george-orwell', 'thomas-mann'],
    };

    const expectedResult = {
      total: 1,
      limit: 100,
      offset: 0,
      books: jasmine.arrayContaining([magicFarm]),
    };

    await expect(findBooks.with(query)).resolves.toStrictEqual(expectedResult);
  });
});
