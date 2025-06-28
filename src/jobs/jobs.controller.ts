import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  Request,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JobCreateDTO } from './dto/job-create.dto';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { UserRole } from '@prisma/client';
import { JobUpdateDTO } from './dto/job-update.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // Job Create
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.EMPLOYER)
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

  // Get All job
  @ApiQuery({ example: 'Backend', name: 'keyword', required: false })
  @ApiQuery({ example: 'Dhaka', name: 'location', required: false })
  @ApiQuery({ example: '10000', name: 'salaryMin', required: false })
  @ApiQuery({ example: '50000', name: 'salaryMax', required: false })
  @ApiQuery({
    example:
      'cf0a7508-7caa-43d7-8b9f-fefa33debcc9,18a8f454-2a3e-4b51-afdf-d35a072cf1de',
    name: 'skillIds',
    required: false,
  })
  @ApiQuery({ example: '10', name: 'limit', required: false })
  @ApiQuery({ example: '1', name: 'page', required: false })
  @Get()
  getAll(@Query() query: any) {
    return this.jobsService.getAllJobs({
      keyword: query.keyword,
      location: query.location,
      salaryMin: query.salaryMin ? Number(query.salaryMin) : undefined,
      salaryMax: query.salaryMax ? Number(query.salaryMax) : undefined,
      skillIds: query.skillIds ? query.skillIds.split(',') : undefined,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    });
  }

  @ApiOperation({ summary: 'Cached Recent Jobs' })
  @Get('recent') // Cached
  getRecentJobs() {
    return this.jobsService.getRecentJobs();
  }

  // Get My Jobs
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @Get('my')
  getMyJobs(@Request() req: any) {
    return this.jobsService.getEmployerJobsWithApplications(req.user.id);
  }

  // Update Job
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: JobUpdateDTO,
  ) {
    return this.jobsService.updateJob(id, req.user.id, body);
  }

  // Delete Job Post
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    return this.jobsService.deleteJob(id, req.user.id);
  }
}
