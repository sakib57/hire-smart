import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApplyDTO } from './dto/application.dto';
import { ApplyUpdateDTO } from './dto/application-update.dto';
import { ApiBearerAuth, ApiHeader, ApiSecurity } from '@nestjs/swagger';
import { seconds, Throttle } from '@nestjs/throttler';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // Apply
  @UsePipes(new ValidationPipe(true))
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @Throttle({
    default: {
      limit: 5,
      ttl: seconds(60),
    },
  })
  @ApiSecurity('X-CSRF-TOKEN')
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
  @UsePipes(new ValidationPipe(true))
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiSecurity('X-CSRF-TOKEN')
  @Patch(':id/status')
  updateStatus(
    @Request() req: any,
    @Param('id') appId: string,
    @Body() updateDto: ApplyUpdateDTO,
  ) {
    return this.applicationsService.updateStatus(req.user.id, appId, updateDto);
  }
}
