import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class BooksQueryDto {
  @IsString()
  @IsOptional()
  readonly identifier?: string;
  @IsString()
  @IsOptional()
  readonly title?: string;
  @Transform((value: string | string[]) =>
    Array.isArray(value)
      ? value
      : value.trim().length
      ? value.trim().split(',')
      : null,
  )
  @IsArray()
  @IsOptional()
  readonly authorIdentifiers?: string[];
  @IsString()
  @IsOptional()
  readonly description?: string;
  @Transform((value: string | string[]) =>
    Array.isArray(value)
      ? value
      : value.trim().length
      ? value.trim().split(',')
      : null,
  )
  @IsArray()
  @IsOptional()
  readonly tagIdentifiers?: string[];
  @IsNumber()
  @IsOptional()
  readonly limit?: number;
  @IsNumber()
  @IsOptional()
  readonly offset?: number;
}
