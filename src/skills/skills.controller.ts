import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillCreateDTO } from './dto/skills-create.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { ApiSecurity } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @UsePipes(new ValidationPipe(true))
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiSecurity('X-CSRF-TOKEN')
  @Post()
  create(@Body() createDto: SkillCreateDTO) {
    return this.skillsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.skillsService.findAll();
  }

  @Delete(':id')
  @ApiSecurity('X-CSRF-TOKEN')
  delete(@Param('id') id: string) {
    return this.skillsService.delete(id);
  }
}
