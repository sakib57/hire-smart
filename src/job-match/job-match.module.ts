import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobMatchService } from './job-match.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JobMatchProcessor } from './job-match.processor';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'job-match',
    }),
  ],
  providers: [JobMatchService, JobMatchProcessor],
  exports: [JobMatchService],
})
export class JobMatchModule {}
