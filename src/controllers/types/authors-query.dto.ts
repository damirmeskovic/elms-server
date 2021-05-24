import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class AuthorsQueryDto {
  @IsString()
  @IsOptional()
  readonly identifier?: string;
  @IsString()
  @IsOptional()
  readonly name?: string;
  @IsString()
  @IsOptional()
  readonly country?: string;
  @IsString()
  @IsOptional()
  readonly bio?: string;
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
