import { JwtService } from '@nestjs/jwt';
import { JwtTokenGenerator } from '../authentication/jwt-token.generator';
import { GenerateToken } from './generate-token.use-case';

describe('TokenGenerationUseCase', () => {
  it('should be defined', () => {
    expect(
      new GenerateToken(new JwtTokenGenerator(new JwtService({}))),
    ).toBeDefined();
  });
});
