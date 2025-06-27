import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobMatchService {
  constructor(@InjectQueue('job-match') private readonly matchQueue: Queue) {}

  async enqueueMatchingJob() {
    await this.matchQueue.add('run-matching', {}, { removeOnComplete: true });
  }
}
