import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../entities/role.enum';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail(
    {},
    {
      message: 'Email must be a valid email address!',
    },
  )
  readonly email: string;
  @ApiProperty()
  @IsString()
  readonly username: string;
  @ApiProperty()
  @IsString()
  readonly password: string;
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
