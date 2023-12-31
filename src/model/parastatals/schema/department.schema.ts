import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema({ timestamps: true })
export class Department {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
