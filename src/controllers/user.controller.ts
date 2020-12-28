import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GenerateToken } from '../use-cases/generate-token.use-case';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { LoginAuthGuard } from '../authentication/login.guard';
import { UserDto } from './types/user.dto';
import { CredentialsDto } from './types/credentials.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly generateToken: GenerateToken) {}

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
}
