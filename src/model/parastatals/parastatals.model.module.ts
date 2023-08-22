import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ParastatalsModelService } from './parastatals.model.service';
import { Parastatals, ParastatalsSchema } from './schema/parastatals.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Parastatals.name,
        useFactory: () => {
          const schema = ParastatalsSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
      {
        name: Parastatals.name,
        useFactory: () => {
          const schema = ParastatalsSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
    ]),
  ],
  providers: [ParastatalsModelService],
  exports: [ParastatalsModelService],
})
export class ParastatalsModelModule {}
