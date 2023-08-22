import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  CreateAssignRoleInterface,
  ForgotPasswordType,
} from '@interfaces/interfaces';
import {
  ForgotPassword,
  ForgotPasswordDocument,
} from './schema/forgot-password.schema';

@Injectable()
export class ForgotPasswordModelService {
  constructor(
    @InjectModel(ForgotPassword.name)
    private forgotPasswordModel: Model<ForgotPassword>,
  ) {}

  async findOne(
    condition: object,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
    },
  ): Promise<ForgotPassword> {
    let query = this.forgotPasswordModel.findOne(condition);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async create(role: ForgotPasswordType): Promise<ForgotPassword> {
    const createdForgotPassword = new this.forgotPasswordModel(role);
    return await createdForgotPassword.save();
  }

  async findOneAndUpdate(
    condition: object,
    document: object,
  ): Promise<ForgotPassword> {
    return await this.forgotPasswordModel.findOneAndUpdate(
      condition,
      document,
      {
        upsert: true,
        new: true,
      },
    );
  }
}
