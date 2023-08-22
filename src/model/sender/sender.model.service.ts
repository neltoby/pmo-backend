import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SenderDataType } from '@interfaces/interfaces';
import { Sender } from './schema/sender.schema';

@Injectable()
export class SenderModelService {
  constructor(
    @InjectModel(Sender.name)
    private senderRoleModel: Model<Sender>,
  ) {}

  async findOne(
    condition: object,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
    },
  ): Promise<Sender> {
    let query = this.senderRoleModel.findOne(condition);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async create(invite: SenderDataType): Promise<Sender> {
    const createdRole = new this.senderRoleModel(invite);
    return await createdRole.save();
  }

  async findOneAndUpdate(condition: object, document: object) {
    return await this.senderRoleModel.findOneAndUpdate(condition, document, {
      upsert: true,
      new: true,
    });
  }

  async findAndDelete(condition) {
    return await this.senderRoleModel.findOneAndDelete(condition);
  }
}
