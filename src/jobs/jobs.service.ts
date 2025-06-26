import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(
    userId: string,
    data: {
      title: string;
      description: string;
      location: string;
      salaryMin: number;
      salaryMax: number;
      skillIds?: string[];
    },
  ) {
    const job = await this.prisma.jobPost.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        employerId: userId,
      },
    });

    if (data.skillIds && data.skillIds.length > 0) {
      await this.prisma.jobSkill.createMany({
        data: data.skillIds.map((skillId) => ({ jobPostId: job.id, skillId })),
        skipDuplicates: true,
      });
    }

    return job;
  }

  async getAllJobs() {
    return this.prisma.jobPost.findMany({
      where: { isArchived: false },
      include: {
        skills: { include: { skill: true } },
        employer: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async archiveOldJobs(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return this.prisma.jobPost.updateMany({
      where: {
        createdAt: { lt: cutoffDate },
        isArchived: false,
      },
      data: {
        isArchived: true,
      },
    });
  }
}
