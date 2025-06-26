import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SkillCreateDTO {
  @ApiProperty({ example: 'C++' })
  @IsString()
  readonly name: string;
}
