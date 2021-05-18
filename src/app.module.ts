import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import repositories from './persistence/persistence.config';
import { jwtConstants } from './authentication/constants';
import { JwtTokenGenerator } from './authentication/jwt-token.generator';
import { JwtStrategy } from './authentication/jwt.strategy';
import { LoginStrategy } from './authentication/login.strategy';
import { RolesGuard } from './authentication/roles.guard';
import useCases from './use-cases/use-cases.config';
import controllers from './controllers/controllers.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [...controllers],
  providers: [
    LoginStrategy,
    JwtStrategy,
    JwtTokenGenerator,
    RolesGuard,
    ...repositories,
    ...useCases,
  ],
})
export class AppModule {}
