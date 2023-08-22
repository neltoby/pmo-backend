import { Job } from 'bull';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import {
  NOTIFICATION_QUEUE,
  CREATE_USER_EMAIL_JOB,
  ASSIGN_ROLE_MAIL_JOB,
  INVITE_USER_JOB,
} from '../constants';
import { EmailService } from '@email/email.service';
import { MyLoggerService } from '@mylogger/mylogger.service';

@Processor(NOTIFICATION_QUEUE)
export class NotificationQueueConsumerProcessor {
  constructor(
    private emailService: EmailService,
    private logger: MyLoggerService,
  ) {}

  @Process(CREATE_USER_EMAIL_JOB)
  async sendSuperAdminMail(job: Job) {
    await this.emailService.sendEmailJobs(job);
  }

  @Process(ASSIGN_ROLE_MAIL_JOB)
  async assignRoleMail(job: Job) {
    await this.emailService.sendEmailJobs(job);
  }

  @Process(INVITE_USER_JOB)
  async inviteUser(job: Job) {
    await this.emailService.sendEmailJobs(job);
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}...`,
    );
  }

  @OnQueueProgress()
  async onProgress(job: Job) {
    this.logger.log(
      `${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )} progressed to ${await job.progress}`,
    );
  }
  @OnQueueFailed()
  async onFailed(job: Job) {
    console.log(
      `${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )} failed`,
    );
  }

  @OnQueueCompleted()
  async onComplete(job: Job) {
    console.log(
      `${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )} completed`,
    );
  }

  @OnQueueError()
  onError(job: Job) {
    console.log(
      `${job.id} with ${job.name} errored with data ${JSON.stringify(
        job.data,
      )}`,
    );
  }
}
