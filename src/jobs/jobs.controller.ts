import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { AuthGuard } from '@nestjs/passport';
import { JobCreateDTO } from './dto/jobs-create.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe(true))
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @Post()
  create(@Request() req: any, @Body() body: JobCreateDTO) {
    return this.jobsService.createJob(req.user.id, body);
  }

  @Get()
  getAll() {
    return this.jobsService.getAllJobs();
  }
}
