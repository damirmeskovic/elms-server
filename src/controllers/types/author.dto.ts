import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TagDto } from './tag.dto';

export class AuthorDto {
  @ApiProperty()
  readonly identifier: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly country: string;
  @ApiPropertyOptional()
  readonly bio?: string;
  @ApiPropertyOptional({ type: 'TagDto', isArray: true })
  readonly tags?: TagDto[];
}
