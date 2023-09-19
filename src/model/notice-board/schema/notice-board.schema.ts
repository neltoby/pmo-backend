import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Type } from 'class-transformer';

import { NoticeMessageBy, NoticeMessageTo } from '@interfaces/interfaces';

export type NoticeBoardDocument = HydratedDocument<NoticeBoard>;

@Schema({ timestamps: true })
export class NoticeBoard {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  admin_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true, enum: NoticeMessageTo })
  to: NoticeMessageTo;

  @Prop({ type: String, required: true, enum: NoticeMessageBy })
  by: NoticeMessageBy;

  @Prop({ type: String })
  to_user: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Parastatals' })
  to_parastatal: MongooseSchema.Types.ObjectId[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const NoticeBoardSchema = SchemaFactory.createForClass(NoticeBoard);
