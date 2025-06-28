import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ApiBearerAuth, ApiHeader, ApiQuery } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @Get('metrics')
  getPlatformMetrics() {
    return this.adminService.getMetrics();
  }

  @ApiQuery({
    example: '18a8f454-2a3e-4b51-afdf-d35a072cf1de',
    name: 'employerId',
    required: false,
  })
  @Get('employer-app-stats')
  getEmployerStats(@Query('employerId') employerId: string) {
    return this.adminService.getEmployerApplicationStats(employerId);
  }
}
