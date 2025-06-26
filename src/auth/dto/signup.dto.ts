import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignupDTO {
  @ApiProperty({ example: 'Nazmus Sakib' })
  @IsString()
  readonly fullName: string;

  @ApiProperty({ example: 'sakib.tnt@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(60)
  readonly password: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsString()
  @IsOptional()
  readonly location: string;

  @ApiProperty({ example: UserRole.CANDIDATE })
  @IsEnum(UserRole)
  readonly role: UserRole;
}
