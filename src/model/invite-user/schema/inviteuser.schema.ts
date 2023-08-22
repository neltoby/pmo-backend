import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Sender } from '@model/sender/schema/sender.schema';
import { InviteStatus, Role } from '@interfaces/interfaces';
import { Parastatals } from '@model/parastatals/schema/parastatals.schema';
import { Department } from '@model/parastatals/schema/department.schema';

export type InviteUserDocument = HydratedDocument<InviteUser>;

@Schema()
export class InviteUser {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: Sender, required: true })
  sender: Sender;

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string;

  @Prop({ type: String })
  role: Role;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parastatals' })
  parastatals: Parastatals;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Department' })
  department: Department;

  @Prop({ type: String, default: 'awaiting', enum: ['awaiting', 'fulfilled'] })
  status: InviteStatus;

  @Prop({ type: Date, default: new Date() })
  date: Date;
}

export const InviteUserSchema = SchemaFactory.createForClass(InviteUser);
