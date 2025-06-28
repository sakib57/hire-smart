import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class AdminService {
  private readonly redis: Redis;
  constructor(private readonly prisma: PrismaService) {
    this.redis = new Redis();
  }

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

  // Get Employer Application matrix cached
  async getEmployerApplicationStats(employerId: string) {
    const cacheKey = `employer_stats:${employerId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const stats = await this.prisma.application.groupBy({
      by: ['status'],
      where: {
        jobPostId: {
          in: await this.prisma.jobPost
            .findMany({
              where: { employerId },
              select: { id: true },
            })
            .then((jobs) => jobs.map((j) => j.id)),
        },
      },
      _count: true,
    });

    const result = stats.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {});

    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 120); // 2 min
    return result;
  }
}
