import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateAssignRoleInterface } from '@interfaces/interfaces';
import { AssignedRole } from './schema/assigned-roles.schema';

@Injectable()
export class AssignedRoleModelService {
  constructor(
    @InjectModel(AssignedRole.name)
    private assignedRoleModel: Model<AssignedRole>,
  ) {}

  async findOneAssignedRole(
    condition: object,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
    },
  ): Promise<AssignedRole> {
    let query = this.assignedRoleModel.findOne(condition);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async createAssignedRole(
    role: CreateAssignRoleInterface,
  ): Promise<AssignedRole> {
    const createdRole = new this.assignedRoleModel(role);
    return await createdRole.save();
  }

  async findOneAndUpdateAssignedRole(condition: object, document: object) {
    return await this.assignedRoleModel.findOneAndUpdate(condition, document, {
      upsert: true,
      new: true,
    });
  }
}
