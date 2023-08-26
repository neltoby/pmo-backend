import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from '@model/user/schema/user.schema';
import { BankAcctStatus } from '@interfaces/interfaces';

export type ProjectsDetailsDocument = HydratedDocument<ProjectsDetails>;

@Schema({ timestamps: true })
export class ProjectsDetails {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user: User;

  @Prop({ type: String, required: true })
  name_of_bank: string;

  @Prop({ type: String, required: true })
  account_no;
  string;

  @Prop({ type: String, required: true })
  purpose_of_acct: string;

  @Prop({ type: Number, required: true })
  balance_for_the_day: number;

  @Prop({ type: Number, required: true })
  cashbook_balance: number;

  @Prop({
    type: String,
    required: true,
    default: BankAcctStatus.Active,
    enum: [BankAcctStatus.Active, BankAcctStatus.Closed],
  })
  status_of_bank_account: BankAcctStatus;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ProjectsSchema = SchemaFactory.createForClass(ProjectsDetails);
