import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FindBooks } from '../../use-cases/book/find-books.use-case';
import { JwtAuthGuard } from '../../authentication/jwt-auth.guard';
import { Roles } from '../../authentication/roles.decorator';
import { RolesGuard } from '../../authentication/roles.guard';
import { Role } from '../../entities/role.enum';
import { ApiPaginatedResponse } from '../api-paginated-response';
import { BookDto } from './book.dto';
import { BooksQueryDto } from './books-query.dto';
import { PaginatedDto } from '../paginated.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly findBooks: FindBooks) {}

  @ApiBearerAuth()
  @ApiPaginatedResponse(BookDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({
    description: 'User does not have necessary permissions.',
  })
  @ApiQuery({ name: 'identifier', required: false, type: 'string' })
  @ApiQuery({ name: 'title', required: false, type: 'string' })
  @ApiQuery({
    name: 'authorIdentifiers',
    type: 'string',
    isArray: true,
    required: false,
    explode: true,
  })
  @ApiQuery({ name: 'description', required: false, type: 'string' })
  @ApiQuery({
    name: 'tagIdentifiers',
    type: 'string',
    isArray: true,
    required: false,
    explode: true,
  })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async find(@Query() query: BooksQueryDto): Promise<PaginatedDto<BookDto>> {
    const result = await this.findBooks.with({ ...query });

    return {
      total: result.total,
      offset: result.offset,
      limit: result.limit,
      items: result.books.map((book) => ({
        identifier: book.identifier,
        title: book.title,
        authors: book.authors.map((author) => ({ ...author })),
        description: book.description,
        tags: book.tags.map((tag) => ({ ...tag })),
      })),
    };
  }
}
