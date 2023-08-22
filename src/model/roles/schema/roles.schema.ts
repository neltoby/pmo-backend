import { Role } from '@interfaces/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { SuperAdmin } from 'src/super-admin/model/schema/superuser.schema';

export type RolesDocument = HydratedDocument<Roles>;

@Schema()
export class Roles {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  adminassigner: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'SuperAdmin' })
  superadminassigner: SuperAdmin;

  @Prop({ type: String, required: true })
  role: Role;

  @Prop({ type: Date, default: new Date() })
  date: Date;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
