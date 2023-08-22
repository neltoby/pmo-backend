import { Inject, Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import {
  EJS,
  MAIL_MODULE,
  MAIL_PROVIDER,
  UseclassReturnType,
} from './mailer.module';
import { EmailOptions } from '@interfaces/interfaces';
import { MyLoggerService } from '@mylogger/mylogger.service';

@Injectable()
export class MailerService {
  transporter: Transporter;
  constructor(
    @Inject(MAIL_PROVIDER) private options: UseclassReturnType,
    @Inject(MAIL_MODULE) private mailMoadule: typeof nodemailer,
    @Inject(EJS) private ejsHandler: typeof ejs,
    private logger: MyLoggerService,
  ) {
    this.transporter = this.mailMoadule.createTransport(
      this.options.transport as unknown,
    );
    const ejsOptions = {
      viewPath: this.options.template.dir,
    };
  }

  async sendMail(mail: EmailOptions) {
    try {
      const data = await this.ejsHandler.renderFile(
        `${this.options.template.dir}/${mail.template}.ejs`,
        mail.context,
      );
      const { context, template, attachments, ...opt } = mail;
      await this.transporter.sendMail({ ...opt, html: data });
    } catch (err) {
      this.logger.error(err.message);
      throw new Error(err);
    }
  }
}
