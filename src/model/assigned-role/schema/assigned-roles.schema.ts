import { AssignedRoleDoc } from '@interfaces/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Roles } from '../../roles/schema/roles.schema';

export type AssignedRoleDocument = HydratedDocument<AssignedRole>;

@Schema()
export class AssignedRole {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Roles' })
  roles: Roles;

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string;

  @Prop({ type: Date, default: new Date() })
  date: Date;
}

export const AssignedRoleSchema = SchemaFactory.createForClass(AssignedRole);
