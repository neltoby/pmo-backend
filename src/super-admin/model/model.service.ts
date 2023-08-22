import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SuperAdmin, SuperAdminDocument } from './schema/superuser.schema';
import { SignupSuperUserType } from '@interfaces/interfaces';

@Injectable()
export class ModelService {
  constructor(
    @InjectModel(SuperAdmin.name) private userModel: Model<SuperAdmin>,
  ) {}

  async findOne(
    condition: object,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
    },
  ): Promise<SuperAdmin> {
    let query = this.userModel.findOne(condition);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async create(user: SignupSuperUserType): Promise<SuperAdmin> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  async findOneAndUpdate(filter: object, update: object, options?: object) {
    return await this.userModel.findOneAndUpdate(filter, update, options);
  }

  async findOneAndDelete(filter: object, options?: object) {
    return await this.userModel.findOneAndDelete(filter, options);
  }
}
