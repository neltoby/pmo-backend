import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Type } from 'class-transformer';

import { Role } from '@interfaces/interfaces';
import { Parastatals } from '@model/parastatals/schema/parastatals.schema';
import { Verified } from '@interfaces/interfaces';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
  },
})
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

  @Prop({ type: Boolean, required: true })
  is_hod: boolean;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  profile_image: string;

  @Prop({ type: String, enum: Role, default: Role.Staff })
  role: Role;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Parastatals' })
  @Type(() => User)
  parastatal: Parastatals;

  @Prop({ type: String })
  department?: string;

  @Prop({ type: String, enum: [Verified], default: Verified.Unverified })
  verified: Verified;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  verified_by: MongooseSchema.Types.ObjectId;

  @Prop({ type: [String] })
  token: string[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  fullname: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstname} ${this.middlename} ${this.lastname}`.trim();
});
