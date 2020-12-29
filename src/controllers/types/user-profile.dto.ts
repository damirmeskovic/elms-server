import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../entities/role.enum';

export class UserProfileDto {
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly username: string;
  @ApiPropertyOptional({ enum: Role, isArray: true })
  readonly roles?: Role[];
  @ApiPropertyOptional()
  readonly name?: string;
  @ApiPropertyOptional()
  readonly bio?: string;
}
