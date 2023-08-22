import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { InviteUserDataType } from '@interfaces/interfaces';
import { InviteUser, InviteUserDocument } from './schema/inviteuser.schema';

@Injectable()
export class InviteUserModelService {
  constructor(
    @InjectModel(InviteUser.name)
    private inviteuserRoleModel: Model<InviteUser>,
  ) {}

  async findOne(
    condition: object,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
    },
  ): Promise<InviteUser> {
    let query = this.inviteuserRoleModel.findOne(condition);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async create(invite: InviteUserDataType): Promise<InviteUser> {
    const createdRole = new this.inviteuserRoleModel(invite);
    return await createdRole.save();
  }

  async findOneAndUpdate(condition: object, document: object) {
    return await this.inviteuserRoleModel.findOneAndUpdate(
      condition,
      document,
      {
        upsert: true,
        new: true,
      },
    );
  }

  async findAndDelete(condition) {
    return await this.inviteuserRoleModel.findOneAndDelete(condition);
  }
}
