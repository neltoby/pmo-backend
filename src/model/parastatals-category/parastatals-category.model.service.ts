import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ParastatalsCategory } from './schema/parastatals-category.schema';
import { MyLoggerService } from '@mylogger/mylogger.service';

@Injectable()
export class ParastatalsCategoryModelService {
  constructor(
    @InjectModel(ParastatalsCategory.name)
    private parastatalsCategoryModel: Model<ParastatalsCategory>,
    private logger: MyLoggerService,
  ) {}

  async findOne(
    condition: object,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
    },
  ): Promise<ParastatalsCategory> {
    let query = this.parastatalsCategoryModel.findOne(condition);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async findById(
    id: Types.ObjectId,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
    },
  ): Promise<ParastatalsCategory> {
    let query = this.parastatalsCategoryModel.findById(id);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async findAll(projection?: {
    select?: string | Array<string> | Record<string, number | boolean | object>;
    sort?: Record<string, any>;
  }): Promise<ParastatalsCategory[]> {
    let query = this.parastatalsCategoryModel.find({});
    query = projection?.select
      ? query.select(projection.select)
      : projection?.sort
      ? query.sort(projection.sort)
      : query;
    return await query.exec();
  }

  async create(category: { name: string }): Promise<ParastatalsCategory> {
    const createdRole = new this.parastatalsCategoryModel(category);
    return await createdRole.save();
  }

  async findOneAndUpdate(condition: object, document: object) {
    return await this.parastatalsCategoryModel.findOneAndUpdate(
      condition,
      document,
      {
        upsert: true,
        new: true,
      },
    );
  }

  async findAndDelete(condition) {
    return await this.parastatalsCategoryModel.findOneAndDelete(condition);
  }

  rawModel() {
    return this.parastatalsCategoryModel;
  }
}
