import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import adapters from './adapters.config';
import { jwtConstants } from './authentication/constants';
import { JwtTokenGenerator } from './authentication/jwt-token.generator';
import { JwtStrategy } from './authentication/jwt.strategy';
import { LoginStrategy } from './authentication/login.strategy';
import { RolesGuard } from './authentication/roles.guard';
import { UserController } from './controllers/user.controller';
import useCases from './use-cases.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [UserController],
  providers: [
    LoginStrategy,
    JwtStrategy,
    JwtTokenGenerator,
    RolesGuard,
    ...adapters,
    ...useCases,
  ],
})
export class AppModule {}
