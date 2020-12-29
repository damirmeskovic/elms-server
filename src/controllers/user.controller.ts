import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { LoginAuthGuard } from '../authentication/login.guard';
import { CreateUser } from '../use-cases/create-user.use-case';
import { GenerateToken } from '../use-cases/generate-token.use-case';
import { CreateUserDto } from './types/create-user.dto';
import { CredentialsDto } from './types/credentials.dto';
import { UserProfileDto } from './types/user-profile.dto';
import { UserDto } from './types/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly generateToken: GenerateToken,
    private readonly createUser: CreateUser,
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
      name: user.name,
      bio: user.bio,
    };
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Returns the created user.',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiBadRequestResponse({
    description: 'User could not be created, see error message for details.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUser: CreateUserDto): Promise<UserProfileDto> {
    try {
      const user = await this.createUser.withProperties(createUser);
      return {
        email: user.email,
        username: user.username,
        name: user.name,
        bio: user.bio,
      };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
