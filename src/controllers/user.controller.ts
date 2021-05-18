import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { LoginAuthGuard } from '../authentication/login.guard';
import { Roles } from '../authentication/roles.decorator';
import { RolesGuard } from '../authentication/roles.guard';
import { Role } from '../entities/role.enum';
import { CreateUser } from '../use-cases/user/create-user.use-case';
import { GenerateToken } from '../use-cases/authentication/generate-token.use-case';
import { UpdateUser } from '../use-cases/user/update-user.use-case';
import { CreateUserDto } from './types/create-user.dto';
import { CredentialsDto } from './types/credentials.dto';
import { UpdateUserDto } from './types/update-user.dto';
import { UserProfileDto } from './types/user-profile.dto';
import { UserDto } from './types/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly generateToken: GenerateToken,
    private readonly createUser: CreateUser,
    private readonly updateUser: UpdateUser,
  ) {}

  @ApiCreatedResponse({
    description: 'User was succesfully logged in.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseGuards(LoginAuthGuard)
  @Post('login')
  async login(
    @Request() request,
    @Body() credentials: CredentialsDto,
  ): Promise<UserDto> {
    const { token, user } = request.user;

    return {
      token,
      email: user.email,
      username: user.username,
      roles: user.roles,
      name: user.name,
      bio: user.bio,
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns logged in user.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async currentUser(@Request() request): Promise<UserDto> {
    const user = request.user;
    const token = await this.generateToken.forUser(user);

    return {
      token,
      email: user.email,
      username: user.username,
      roles: user.roles,
      name: user.name,
      bio: user.bio,
    };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Returns the created user.',
    type: UserProfileDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({
    description: 'User does not have necessary permisions.',
  })
  @ApiBadRequestResponse({
    description: 'User could not be created, see error message for details.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() createUser: CreateUserDto): Promise<UserProfileDto> {
    try {
      const user = await this.createUser.withProperties(createUser);
      return {
        email: user.email,
        username: user.username,
        roles: user.roles,
        name: user.name,
        bio: user.bio,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns the updated user.',
    type: UserProfileDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have necessary permisions.',
  })
  @ApiBadRequestResponse({
    description: 'User could not be updated, see error message for details.',
  })
  @ApiParam({
    name: 'username',
    type: 'string',
    required: true,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':username')
  async update(
    @Param('username') username: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<UserProfileDto> {
    try {
      const user = await this.updateUser.withProperties({
        username,
        ...updateUser,
      });
      return {
        email: user.email,
        username: user.username,
        roles: user.roles,
        name: user.name,
        bio: user.bio,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
