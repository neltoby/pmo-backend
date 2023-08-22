import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesModelService } from './roles.model.service';
import { Roles, RolesSchema } from './schema/roles.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Roles.name,
        useFactory: () => {
          const schema = RolesSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
    ]),
  ],
  providers: [RolesModelService],
  exports: [RolesModelService],
})
export class RolesModelModule {}
