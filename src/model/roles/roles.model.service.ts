import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Roles, RolesDocument } from './schema/roles.schema';
import { CreateRoles } from '@interfaces/interfaces';

@Injectable()
export class RolesModelService {
  constructor(@InjectModel(Roles.name) private rolesModel: Model<Roles>) {}

  async findOne(
    condition: object,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
    },
  ): Promise<Roles> {
    let query = this.rolesModel.findOne(condition);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async create(user: CreateRoles): Promise<Roles> {
    const createdUser = new this.rolesModel(user);
    return await createdUser.save();
  }

  async findOneAndUpdate(filter: object, update: object, options?: object) {
    return await this.rolesModel.findOneAndUpdate(filter, update, options);
  }
}
