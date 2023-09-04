import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ParastatalsCategoryModelService } from './parastatals-category.model.service';
import {
  ParastatalsCategory,
  ParastatalsCategorySchema,
} from './schema/parastatals-category.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ParastatalsCategory.name,
        useFactory: () => {
          const schema = ParastatalsCategorySchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
    ]),
  ],
  providers: [ParastatalsCategoryModelService],
  exports: [ParastatalsCategoryModelService],
})
export class ParastatalsCategoryModelModule {}
