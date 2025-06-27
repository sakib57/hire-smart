import { Module } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JobMatchModule } from 'src/job-match/job-match.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, JobMatchModule],
  providers: [TaskService],
})
export class TasksModule {}
