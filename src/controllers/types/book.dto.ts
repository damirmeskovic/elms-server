import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthorDto } from './author.dto';
import { TagDto } from './tag.dto';

export class BookDto {
  @ApiProperty()
  readonly identifier: string;
  @ApiProperty()
  readonly title: string;
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(AuthorDto) },
  })
  readonly authors?: AuthorDto[];
  @ApiPropertyOptional()
  readonly description?: string;
  @ApiPropertyOptional({
    type: 'array',
    items: { $ref: getSchemaPath(TagDto) },
  })
  readonly tags?: TagDto[];
}
