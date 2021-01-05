import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/entities/role.enum';

export class UsersQueryDto {
  @IsString()
  @IsOptional()
  readonly email?: string;
  @IsString()
  @IsOptional()
  readonly name?: string;
  @IsArray()
  @Transform((value: string | string[]) =>
    Array.isArray(value)
      ? value
      : value.trim().length
      ? value.trim().split(',')
      : null,
  )
  @IsOptional()
  readonly roles?: Role[];
  @IsNumber()
  @IsOptional()
  readonly limit?: number;
  @IsNumber()
  @IsOptional()
  readonly offset?: number;
}
