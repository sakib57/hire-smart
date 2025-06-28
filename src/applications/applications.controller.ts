import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { AuthGuard } from '@nestjs/passport';
import { AppStatus, UserRole } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApplyDTO } from './dto/application.dto';
import { ApplyUpdateDTO } from './dto/application-update.dto';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // Apply
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @Post()
  apply(@Request() req: any, @Body() applyDto: ApplyDTO) {
    return this.applicationsService.apply(req.user.id, applyDto);
  }

  // Get My Applications
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @Get('my')
  getMyApplications(@Request() req: any) {
    return this.applicationsService.getMyApplications(req.user.id);
  }

  // Application Update
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @Throttle({
    default: {
      limit: 5,
      ttl: 60,
    },
  })
  @Patch(':id/status')
  updateStatus(
    @Request() req: any,
    @Param('id') appId: string,
    @Body() updateDto: ApplyUpdateDTO,
  ) {
    return this.applicationsService.updateStatus(req.user.id, appId, updateDto);
  }
}
