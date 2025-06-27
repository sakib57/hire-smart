import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AppStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplyDTO } from './dto/application.dto';
import { ApplyUpdateDTO } from './dto/application-update.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  // Apply for job
  async apply(userId: string, applyDto: ApplyDTO) {
    const { jobPostId } = applyDto;
    const job = await this.prisma.jobPost.findUnique({
      where: { id: jobPostId },
    });
    if (!job || job.isArchived)
      throw new NotFoundException('Job not found or archived');

    return this.prisma.application.create({
      data: {
        userId,
        jobPostId,
        status: AppStatus.PENDING,
      },
    });
  }

  // My applications
  async getMyApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: {
        jobPost: {
          include: {
            employer: { select: { fullName: true, email: true } },
            skills: { include: { skill: true } },
          },
        },
      },
    });
  }

  // Update application
  async updateStatus(
    employerId: string,
    appId: string,
    updateDto: ApplyUpdateDTO,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id: appId },
      include: { jobPost: true },
    });

    if (!application) throw new NotFoundException('Application not found');
    const { status } = updateDto;
    if (application.jobPost.employerId !== employerId) {
      throw new ForbiddenException('Not your job post');
    }

    return this.prisma.application.update({
      where: { id: appId },
      data: { status },
    });
  }
}
