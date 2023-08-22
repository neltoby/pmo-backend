import { Job } from 'bull';
import { Injectable } from '@nestjs/common';

import { EmailOptions } from '@interfaces/interfaces';
import { EmailServiceAbstract } from './abstract/email.service.abstract';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class EmailService extends EmailServiceAbstract {
  constructor(private mailerService: MailerService) {
    super();
  }

  async sendEmail(options: EmailOptions): Promise<unknown> {
    try {
      return await this.mailerService.sendMail(options);
    } catch (e) {
      console.log(e.message);
      throw new Error(e);
    }
  }

  async sendEmailJobs(job: Job) {
    const response = await this.sendEmail(job.data.email);
    if (response) {
      job.progress(100);
      return response;
    }
  }
}
