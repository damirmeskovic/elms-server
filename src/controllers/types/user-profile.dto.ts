import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly username: string;
  @ApiPropertyOptional()
  readonly name?: string;
  @ApiPropertyOptional()
  readonly bio?: string;
}
