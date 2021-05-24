import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FindAuthors } from '../use-cases/author/find-authors.use-case';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { Roles } from '../authentication/roles.decorator';
import { RolesGuard } from '../authentication/roles.guard';
import { Role } from '../entities/role.enum';
import { ApiPaginatedResponse } from './types/api-paginated-response';
import { AuthorDto } from './types/author.dto';
import { PaginatedDto } from './types/paginated.dto';
import { AuthorsQueryDto } from './types/authors-query.dto';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly findAuthors: FindAuthors) {}

  @ApiBearerAuth()
  @ApiPaginatedResponse(AuthorDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({
    description: 'User does not have necessary permissions.',
  })
  @ApiQuery({ name: 'identifier', required: false, type: 'string' })
  @ApiQuery({ name: 'title', required: false, type: 'string' })
  @ApiQuery({
    name: 'authors',
    type: 'string',
    isArray: true,
    required: false,
    explode: true,
  })
  @ApiQuery({ name: 'description', required: false, type: 'string' })
  @ApiQuery({
    name: 'tags',
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
  async find(
    @Query() query: AuthorsQueryDto,
  ): Promise<PaginatedDto<AuthorDto>> {
    const result = await this.findAuthors.with({ ...query });

    return {
      total: result.total,
      offset: result.offset,
      limit: result.limit,
      items: result.authors.map((author) => ({
        identifier: author.identifier,
        name: author.name,
        country: author.country,
        bio: author.bio,
        tags: author.tags.map((tag) => ({ ...tag })),
      })),
    };
  }
}
