import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InviteUserModelService } from './inviteuser.model.service';
import { InviteUser, InviteUserSchema } from './schema/inviteuser.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: InviteUser.name,
        useFactory: () => {
          const schema = InviteUserSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
    ]),
  ],
  providers: [InviteUserModelService],
  exports: [InviteUserModelService],
})
export class InviteUserModelModule {}
