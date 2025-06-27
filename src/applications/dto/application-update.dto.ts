import { ApiProperty } from '@nestjs/swagger';
import { AppStatus } from '@prisma/client';
import { IsString } from 'class-validator';

export class ApplyUpdateDTO {
  @ApiProperty({ example: AppStatus.ACCEPTED })
  @IsString()
  readonly status: AppStatus;
}
