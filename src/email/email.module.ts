import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EmailService } from './email.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        console.log(path.resolve(__dirname, '../assets/templates/partials'));
        return {
          transport: {
            host: config.get('mailtrapHost'),
            port: config.get('mailtrapPort'),
            auth: {
              user: config.get('mailtrapAuthUser'),
              pass: config.get('mailtrapAuthPass'),
            },
          },
          defaults: {
            from: '"Transfer-safe" <neltoby@gmail.com>',
          },
          template: {
            dir: path.resolve(__dirname, '../assets/templates'),
          },
          options: {
            partials: path.resolve(__dirname, '../assets/templates/partials'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
