import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class UserUpdateDTO {
  @ApiProperty({ example: 'Nazmus Sakib' })
  @IsString()
  @IsOptional()
  readonly fullName: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsString()
  @IsOptional()
  readonly location: string;

  @ApiProperty({ example: 70000 })
  @IsNumber()
  @IsOptional()
  readonly expectedSalary: number;

  @ApiProperty({
    example: [
      '11908c40-eb1d-43bd-a8cb-69a77c847724',
      '18a8f454-2a3e-4b51-afdf-d35a072cf1de',
    ],
  })
  @IsArray()
  @IsOptional()
  readonly skillIds: string[];
}
