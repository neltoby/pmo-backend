import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Department } from './department.schema';

export type ParastatalsDocument = HydratedDocument<Parastatals>;

@Schema()
export class Parastatals {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;

  @Prop()
  department: Department[];

  @Prop({ type: Date, default: new Date() })
  date: Date;
}

export const ParastatalsSchema = SchemaFactory.createForClass(Parastatals);
