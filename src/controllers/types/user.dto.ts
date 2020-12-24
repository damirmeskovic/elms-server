import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly token: string;
  @ApiProperty()
  readonly username: string;
  @ApiPropertyOptional()
  readonly bio?: string;
}
