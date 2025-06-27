import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsString, IsNumber, IsArray } from 'class-validator';

export class JobUpdateDTO {
  @ApiProperty({ example: 'Backend Developer' })
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Backend developer with 3 years experience' })
  @IsString()
  readonly description: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsString()
  readonly location: string;

  @ApiProperty({ example: 30000 })
  @IsNumber()
  readonly salaryMin: number;

  @ApiProperty({ example: 70000 })
  @IsNumber()
  readonly salaryMax: number;

  @ApiProperty({ example: ['9c753218-ee7d-4aa0-80ad-bd61f3b372d2'] })
  @IsArray()
  readonly skillIds: string[];
}
