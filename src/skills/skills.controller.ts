import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UsePipes,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillCreateDTO } from './dto/skills-create.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @UsePipes(new ValidationPipe(true))
  @Post()
  create(@Body() createDto: SkillCreateDTO) {
    return this.skillsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.skillsService.delete(id);
  }
}
