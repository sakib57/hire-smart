import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics() {
    const [users, jobs, applications] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.jobPost.count(),
      this.prisma.application.count(),
    ]);

    return {
      totalUsers: users,
      totalJobs: jobs,
      totalApplications: applications,
    };
  }
}
