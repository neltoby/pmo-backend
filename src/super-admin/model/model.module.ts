import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ModelService } from './model.service';
import { SuperAdmin, SuperAdminSchema } from './schema/superuser.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: SuperAdmin.name,
        useFactory: () => {
          const schema = SuperAdminSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
    ]),
  ],
  providers: [ModelService],
  exports: [ModelService],
})
export class SuperAdminModelModule {}
