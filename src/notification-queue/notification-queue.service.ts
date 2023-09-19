import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EmailOptions } from '@interfaces/interfaces';
import {
  NOTIFICATION_QUEUE,
  CREATE_USER_EMAIL_JOB,
  ASSIGN_ROLE_MAIL_JOB,
  INVITE_USER_JOB,
  NOTIFY_USER_JOB,
} from '../constants';
import { MyLoggerService } from '@mylogger/mylogger.service';

@Injectable()
export class NotificationQueueService {
  constructor(
    @InjectQueue(NOTIFICATION_QUEUE) private notificationQueue: Queue,
    private logger: MyLoggerService,
  ) {}

  private async createQueue(name: string, email) {
    await this.notificationQueue.add(
      name,
      {
        email,
      },
      {
        attempts: 10,
      },
    );
  }

  async createSuperAdminMail(email: EmailOptions) {
    const url =
      process.env.NODE_ENV !== 'production'
        ? 'http://localhost:3000'
        : 'http://localhost:3001';
    email.context.url = url;
    this.logger.log(
      `Queuing email to be sent ${email} -- Verification email for super admin`,
    );
    await this.createQueue(CREATE_USER_EMAIL_JOB, email);
  }

  async createNonUserRole(email: EmailOptions) {
    this.logger.log(
      `Queuing email to be sent ${email} -- non user email invitation`,
    );
    await this.createQueue(ASSIGN_ROLE_MAIL_JOB, email);
  }

  async sendInviteMail(email: EmailOptions) {
    this.logger.log(
      `Queuing email to be sent ${email} -- invite user to platform mail`,
    );
    await this.createQueue(INVITE_USER_JOB, email);
  }

  async sendNoticeMail(email: EmailOptions) {
    this.logger.log(
      `Queuing email to be sent ${email} --  notify users with mail`,
    );
    await this.createQueue(NOTIFY_USER_JOB, email);
  }
}
