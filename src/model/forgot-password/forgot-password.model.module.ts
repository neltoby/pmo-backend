import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ForgotPasswordModelService } from './forgot-password.model.service';
import {
  ForgotPassword,
  ForgotPasswordSchema,
} from './schema/forgot-password.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ForgotPassword.name,
        useFactory: () => {
          const schema = ForgotPasswordSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
    ]),
  ],
  providers: [ForgotPasswordModelService],
  exports: [ForgotPasswordModelService],
})
export class ForgotPasswordModelModule {}
