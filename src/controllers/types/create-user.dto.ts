import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly password: string;
  @ApiPropertyOptional()
  readonly name?: string;
  @ApiPropertyOptional()
  readonly bio?: string;
}
