import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type SuperAdminDocument = HydratedDocument<SuperAdmin>;

@Schema()
export class SuperAdmin {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true, index: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    index: true,
    unique: true,
    sparse: true,
    select: false,
  })
  token: string;

  @Prop({
    type: String,
    index: true,
    unique: true,
    sparse: true,
    select: false,
  })
  verification_token: string;

  @Prop({
    type: String,
    default: 'unverified',
    enum: ['verified', 'unverified'],
  })
  verified: string;

  @Prop({ type: Date })
  date_verified: Date;

  @Prop({ type: Date, default: new Date() })
  date_created: Date;
}

export const SuperAdminSchema = SchemaFactory.createForClass(SuperAdmin);
