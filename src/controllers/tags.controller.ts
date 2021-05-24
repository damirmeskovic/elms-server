import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FindTags } from '../use-cases/tag/find-tags.use-case';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { Roles } from '../authentication/roles.decorator';
import { RolesGuard } from '../authentication/roles.guard';
import { Role } from '../entities/role.enum';
import { ApiPaginatedResponse } from './types/api-paginated-response';
import { TagDto } from './types/tag.dto';
import { PaginatedDto } from './types/paginated.dto';
import { TagsQueryDto } from './types/tags-query.dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly findTags: FindTags) {}

  @ApiBearerAuth()
  @ApiPaginatedResponse(TagDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({
    description: 'User does not have necessary permissions.',
  })
  @ApiQuery({ name: 'identifier', required: false, type: 'string' })
  @ApiQuery({ name: 'name', required: false, type: 'string' })
  @ApiQuery({ name: 'description', required: false, type: 'string' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'offset', required: false, type: 'number' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async find(@Query() query: TagsQueryDto): Promise<PaginatedDto<TagDto>> {
    const result = await this.findTags.with({ ...query });

    return {
      total: result.total,
      offset: result.offset,
      limit: result.limit,
      items: result.tags.map((tag) => ({
        identifier: tag.identifier,
        name: tag.name,
        bio: tag.description,
      })),
    };
  }
}
