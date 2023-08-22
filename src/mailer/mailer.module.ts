import { DynamicModule, Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { MailerService } from './mailer.service';

type OptionsAsync = {
  useFactory: (options?: any) => UseclassReturnType;
  inject?: any[];
};

type Transporter = {
  host?: string;
  services?: string;
  port: string;
  auth?: {
    user: string;
    pass: string;
  };
};

export type UseclassReturnType = {
  transport: Transporter;

  defaults?: {
    from: string;
    to?: string;
  };
  template: {
    dir: string;
  };
  options?: {
    partials?: string;
    [key: string]: any;
  };
};

export const MAIL_PROVIDER = 'MAIL_PROVIDER';
export const MAIL_MODULE = 'TRANSPORTER';
export const EJS = 'EJS';

@Module({})
export class MailerModule {
  // static forRoot(): DynamicModule {}
  static forRootAsync(options: OptionsAsync): DynamicModule {
    return {
      module: MailerModule,
      imports: [],
      providers: [
        {
          provide: MAIL_PROVIDER,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: MAIL_MODULE,
          useValue: nodemailer,
        },
        {
          provide: EJS,
          useValue: ejs,
        },
        MailerService,
      ],
      exports: [MailerService],
    };
  }
}
