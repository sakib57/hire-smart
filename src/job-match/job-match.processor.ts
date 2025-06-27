import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Processor('job-match')
export class JobMatchProcessor {
  private readonly logger = new Logger(JobMatchProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('run-matching')
  async handleMatch(job: Job) {
    this.logger.log('Running queued job matching process...');

    const users = await this.prisma.user.findMany({
      where: { role: UserRole.CANDIDATE, isActive: true },
      include: { skills: true },
    });

    const jobs = await this.prisma.jobPost.findMany({
      where: { isArchived: false },
      include: { skills: true },
    });

    for (const user of users) {
      const userSkillIds = user.skills.map((s) => s.skillId);
      for (const job of jobs) {
        const jobSkillIds = job.skills.map((js) => js.skillId);
        const hasAllSkills = jobSkillIds.every((id) =>
          userSkillIds.includes(id),
        );

        const locationOk =
          !user.location ||
          job.location.toLowerCase().includes(user.location.toLowerCase());

        const salary = user['expectedSalary'] || 0;
        const salaryOk = job.salaryMin <= salary && job.salaryMax >= salary;

        if (hasAllSkills && locationOk && salaryOk) {
          this.logger.log(`Matched ${user.fullName} to job: ${job.title}`);
          // TODO: Add to notification queue or send push/email
        }
      }
    }
  }
}
