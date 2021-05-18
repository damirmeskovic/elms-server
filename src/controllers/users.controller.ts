import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { Roles } from '../authentication/roles.decorator';
import { RolesGuard } from '../authentication/roles.guard';
import { Role } from '../entities/role.enum';
import { FindUsers } from '../use-cases/user/find-users.use-case';
import { ApiPaginatedResponse } from './types/api-paginated-response';
import { PaginatedDto } from './types/paginated.dto';
import { UserProfileDto } from './types/user-profile.dto';
import { UsersQueryDto } from './types/users-query.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly findUsers: FindUsers) {}

  @ApiBearerAuth()
  @ApiPaginatedResponse(UserProfileDto)
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({
    description: 'User does not have necessary permisions.',
  })
  @ApiQuery({ name: 'email', required: false, type: 'string' })
  @ApiQuery({ name: 'name', required: false, type: 'string' })
  @ApiQuery({
    name: 'roles',
    enum: Role,
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
    @Query() query: UsersQueryDto,
  ): Promise<PaginatedDto<UserProfileDto>> {
    const result = await this.findUsers.with({ ...query });

    return {
      total: result.total,
      offset: result.offset,
      limit: result.limit,
      items: result.users.map((user) => ({
        email: user.email,
        username: user.username,
        roles: user.roles,
        name: user.name,
        bio: user.bio,
      })),
    };
  }
}
