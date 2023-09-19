import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Type } from 'class-transformer';

import { Department } from './department.schema';
import { ParastatalsCategory } from '@model/parastatals-category/schema/parastatals-category.schema';

export type ParastatalsDocument = HydratedDocument<Parastatals>;

@Schema({ timestamps: true })
export class Parastatals {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'ParastatalsCategory',
  })
  @Type(() => ParastatalsCategory)
  category: ParastatalsCategory;

  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;

  @Prop()
  department: Department[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ParastatalsSchema = SchemaFactory.createForClass(Parastatals);
