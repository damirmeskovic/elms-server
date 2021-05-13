import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty()
  readonly identifier: string;
  @ApiProperty()
  readonly name: string;
  @ApiPropertyOptional()
  readonly description?: string;
}
