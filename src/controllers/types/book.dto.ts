import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthorDto } from './author.dto';
import { TagDto } from './tag.dto';

export class BookDto {
  @ApiProperty()
  readonly identifier: string;
  @ApiProperty()
  readonly title: string;
  @ApiProperty({ type: 'AuthorDto', isArray: true })
  readonly authors?: AuthorDto[];
  @ApiPropertyOptional()
  readonly description?: string;
  @ApiPropertyOptional({ type: 'TagDto', isArray: true })
  readonly tags?: TagDto[];
}
