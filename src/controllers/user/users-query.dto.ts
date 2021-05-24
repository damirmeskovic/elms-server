import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../../entities/role.enum';

export class UsersQueryDto {
  @IsString()
  @IsOptional()
  readonly email?: string;
  @IsString()
  @IsOptional()
  readonly name?: string;
  @Transform((value: string | string[]) =>
    Array.isArray(value)
      ? value
      : value.trim().length
      ? value.trim().split(',')
      : null,
  )
  @IsArray()
  @IsEnum(Role, {
    each: true,
    message: 'Each role must be one of allowed values: Admin, Librarian',
  })
  @IsOptional()
  readonly roles?: Role[];
  @IsNumber()
  @IsOptional()
  readonly limit?: number;
  @IsNumber()
  @IsOptional()
  readonly offset?: number;
}
