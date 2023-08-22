import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AssignedRoleModelService } from './assigned-role.model.service';
import {
  AssignedRole,
  AssignedRoleSchema,
} from './schema/assigned-roles.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: AssignedRole.name,
        useFactory: () => {
          const schema = AssignedRoleSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
    ]),
  ],
  providers: [AssignedRoleModelService],
  exports: [AssignedRoleModelService],
})
export class AssignedRoleModelModule {}
