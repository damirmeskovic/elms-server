import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  TokenGenerator,
  TokenPayload,
} from 'src/use-cases/types/token-generator.types';

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  async next(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
