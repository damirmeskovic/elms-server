import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TagsQueryDto {
  @IsString()
  @IsOptional()
  readonly identifier?: string;
  @IsString()
  @IsOptional()
  readonly name?: string;
  @IsString()
  @IsOptional()
  readonly description?: string;
  @IsNumber()
  @IsOptional()
  readonly limit?: number;
  @IsNumber()
  @IsOptional()
  readonly offset?: number;
}
