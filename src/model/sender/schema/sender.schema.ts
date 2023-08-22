import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { User } from '@model/user/schema/user.schema';
import { SuperAdmin } from 'src/super-admin/model/schema/superuser.schema';

export type SenderDocument = HydratedDocument<Sender>;

@Schema()
export class Sender {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: SuperAdmin.name })
  superadmin: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  admin: MongooseSchema.Types.ObjectId;
}

export const SenderSchema = SchemaFactory.createForClass(Sender);
