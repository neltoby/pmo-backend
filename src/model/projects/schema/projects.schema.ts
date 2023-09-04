import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Department } from '@model/parastatals/schema/department.schema';
import { ProjectsDetails } from './projects-details.schema';

export type ProjectsDocument = HydratedDocument<Projects>;

@Schema()
export class Projects {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    unique: true,
    required: true,
    ref: 'Department',
  })
  department: Department;

  @Prop()
  details: ProjectsDetails[];

  @Prop({ type: Date, default: new Date() })
  date: Date;
}

export const ProjectsSchema = SchemaFactory.createForClass(Projects);
