import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SkillsModule } from './skills/skills.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { TasksModule } from './tasks/tasks.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    SkillsModule,
    JobsModule,
    ApplicationsModule,
    TasksModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
