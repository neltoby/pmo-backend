import { ForgotPasswordStatus } from '@interfaces/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ForgotPasswordDocument = HydratedDocument<ForgotPassword>;

@Schema()
export class ForgotPassword {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, index: true, unique: true })
  token: string;

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string;

  @Prop({
    type: String,
    default: 'request change',
    enum: ['request change, changed'],
  })
  status: ForgotPasswordStatus;

  @Prop({ type: Date, default: new Date() })
  date: Date;
}

export const ForgotPasswordSchema =
  SchemaFactory.createForClass(ForgotPassword);
