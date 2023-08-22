import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SenderModelService } from './sender.model.service';
import { Sender, SenderSchema } from './schema/sender.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Sender.name,
        useFactory: () => {
          const schema = SenderSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
    ]),
  ],
  providers: [SenderModelService],
  exports: [SenderModelService],
})
export class SenderModelModule {}
