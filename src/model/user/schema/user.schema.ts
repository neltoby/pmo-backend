import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Roles } from '@model/roles/schema/roles.schema';
import { Parastatals } from '@model/parastatals/schema/parastatals.schema';
import { Department } from '@model/parastatals/schema/department.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  firstname: string;

  @Prop({ type: String, required: true })
  middlename: string;

  @Prop({ type: String, required: true })
  lastname: string;

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string;

  @Prop({ type: Boolean, required: true})
  isHod: boolean;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Roles' })
  role: Roles;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parastatals' })
  parastatals: Parastatals;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Department' })
  department: Department;

  @Prop({ type: Date, default: new Date() })
  date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
