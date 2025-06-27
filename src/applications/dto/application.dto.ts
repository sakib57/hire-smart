import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ApplyDTO {
  @ApiProperty({ example: '9c753218-ee7d-4aa0-80ad-bd61f3b372d2' })
  @IsString()
  readonly jobPostId: string;
}
