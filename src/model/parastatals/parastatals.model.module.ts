import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ParastatalsModelService } from './parastatals.model.service';
import { Parastatals, ParastatalsSchema } from './schema/parastatals.schema';
import { ParastatalsCategoryModelModule } from '@model/parastatals-category/parastatals-category.model.module';

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
    ]),
    ParastatalsCategoryModelModule,
  ],
  providers: [ParastatalsModelService],
  exports: [ParastatalsModelService],
})
export class ParastatalsModelModule {}
