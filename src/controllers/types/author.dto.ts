import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
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
  @ApiPropertyOptional({
    type: 'array',
    items: { $ref: getSchemaPath(TagDto) },
  })
  readonly tags?: TagDto[];
}
