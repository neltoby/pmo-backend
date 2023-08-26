import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AggregateOptions, Model, PipelineStage } from 'mongoose';
import { Projects } from './schema/projects.schema';
import { CreateProjects } from '@interfaces/interfaces';

@Injectable()
export class ProjectsModelService {
  constructor(
    @InjectModel(Projects.name) private projectsModel: Model<Projects>,
  ) {}

  async findOne(
    condition: object,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
    },
  ): Promise<Projects> {
    let query = this.projectsModel.findOne(condition);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async findAll(
    condition: object,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
    },
  ): Promise<Projects[]> {
    let query = this.projectsModel.find(condition);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async create(user: CreateProjects): Promise<Projects> {
    const createdUser = new this.projectsModel(user);
    return await createdUser.save();
  }

  async findOneAndUpdate(filter: object, update: object, options?: object) {
    return await this.projectsModel.findOneAndUpdate(filter, update, options);
  }

  async findWithinRanges(q: Record<string, any>) {
    const query = this.projectsModel.find(q);
    return await query.exec();
  }

  async findWithAggregations(q: PipelineStage[], options?: AggregateOptions) {
    return await this.projectsModel.aggregate(q, options);
  }
}
