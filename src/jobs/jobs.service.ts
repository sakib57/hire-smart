import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobCreateDTO } from './dto/job-create.dto';
import { JobUpdateDTO } from './dto/job-update.dto';
import Redis from 'ioredis';

@Injectable()
export class JobsService {
  private readonly redis: Redis;
  constructor(private readonly prisma: PrismaService) {
    this.redis = new Redis();
  }

  // Create Job Post
  async createJob(userId: string, data: JobCreateDTO) {
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

  // Get All Job Post
  async getAllJobs(filters: {
    keyword?: string;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    skillIds?: string[];
    page?: number;
    limit?: number;
  }) {
    const {
      keyword,
      location,
      salaryMin,
      salaryMax,
      skillIds,
      page = 1,
      limit = 10,
    } = filters;

    const where: any = {
      isArchived: false,
    };

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (salaryMin || salaryMax) {
      where.AND = [
        ...(salaryMin ? [{ salaryMin: { gte: salaryMin } }] : []),
        ...(salaryMax ? [{ salaryMax: { lte: salaryMax } }] : []),
      ];
    }

    if (skillIds && skillIds.length > 0) {
      where.skills = {
        some: {
          skillId: {
            in: skillIds,
          },
        },
      };
    }

    const [jobs, total] = await this.prisma.$transaction([
      this.prisma.jobPost.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          skills: { include: { skill: true } },
          employer: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.jobPost.count({ where }),
    ]);

    return {
      data: jobs,
      total,
      page,
      limit,
    };
  }

  // Get Recent Jobs
  async getRecentJobs() {
    const cacheKey = 'recent_jobs';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const jobs = await this.prisma.jobPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { skills: true },
    });

    await this.redis.set(cacheKey, JSON.stringify(jobs), 'EX', 300); // 5 min
    return jobs;
  }

  // Get employer jobs with applications
  async getEmployerJobsWithApplications(employerId: string) {
    return this.prisma.jobPost.findMany({
      where: { employerId },
      include: {
        skills: { include: { skill: true } },
        applications: {
          include: {
            user: {
              select: { id: true, fullName: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Update Job Post
  async updateJob(jobId: string, employerId: string, data: JobUpdateDTO) {
    const job = await this.prisma.jobPost.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.employerId !== employerId)
      throw new ForbiddenException('Unauthorized');

    const updated = await this.prisma.jobPost.update({
      where: { id: jobId },
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
      },
    });

    if (data.skillIds) {
      await this.prisma.jobSkill.deleteMany({ where: { jobPostId: jobId } });
      await this.prisma.jobSkill.createMany({
        data: data.skillIds.map((skillId) => ({ jobPostId: jobId, skillId })),
        skipDuplicates: true,
      });
    }

    return updated;
  }

  // Delete Job Post
  async deleteJob(jobId: string, employerId: string) {
    const job = await this.prisma.jobPost.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Job not found');
    if (job.employerId !== employerId)
      throw new ForbiddenException('Unauthorized');

    await this.prisma.jobSkill.deleteMany({ where: { jobPostId: jobId } });
    return this.prisma.jobPost.delete({ where: { id: jobId } });
  }

  // Archive Job Posts
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
