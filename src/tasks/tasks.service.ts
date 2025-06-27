import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { JobMatchService } from 'src/job-match/job-match.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jobMatchService: JobMatchService,
  ) {}

  // Background Process for Matching Jobs and Log/Notify
  @Cron(CronExpression.EVERY_HOUR)
  async triggerQueue() {
    await this.jobMatchService.enqueueMatchingJob();
  }

  // Scheduled task for Archive 30 days older jobs
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async archiveOldJobs() {
    this.logger.log('Archiving job posts older than 30 days...');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const result = await this.prisma.jobPost.updateMany({
      where: {
        createdAt: { lt: cutoffDate },
        isArchived: false,
      },
      data: {
        isArchived: true,
      },
    });

    this.logger.log(`Archived ${result.count} job posts.`);
  }

  // Scheduled task for remove unverified user every week
  @Cron(CronExpression.EVERY_WEEK)
  async removeUnverifiedUsers() {
    this.logger.log('Removing unverified users...');

    const result = await this.prisma.user.deleteMany({
      where: {
        isVerified: false,
        createdAt: {
          lt: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    });

    this.logger.log(`Removed ${result.count} unverified users.`);
  }
}
