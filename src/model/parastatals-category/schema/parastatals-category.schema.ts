import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ParastatalsCategoryDocument = HydratedDocument<ParastatalsCategory>;

@Schema({ timestamps: true })
export class ParastatalsCategory {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ParastatalsCategorySchema =
  SchemaFactory.createForClass(ParastatalsCategory);
