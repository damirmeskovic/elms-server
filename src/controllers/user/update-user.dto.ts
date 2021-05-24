import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../entities/role.enum';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsEmail(
    {},
    {
      message: 'Email must be a valid email address!',
    },
  )
  @IsOptional()
  readonly email?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly password?: string;
  @ApiPropertyOptional({ enum: Role, isArray: true })
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
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly name?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly bio?: string;
}
