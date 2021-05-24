import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../entities/role.enum';

export class UserDto {
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly token: string;
  @ApiProperty()
  readonly username: string;
  @ApiPropertyOptional({ enum: Role, isArray: true })
  readonly roles?: Role[];
  @ApiPropertyOptional()
  readonly name?: string;
  @ApiPropertyOptional()
  readonly bio?: string;
}
