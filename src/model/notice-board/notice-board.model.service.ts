import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';

import { NoticeBoard } from './schema/notice-board.schema';
import { MyLoggerService } from '@mylogger/mylogger.service';
import { NoticeDataType } from '@interfaces/interfaces';

@Injectable()
export class NoticeBoardModelService {
  constructor(
    @InjectModel(NoticeBoard.name) private noticeBoardModel: Model<NoticeBoard>,
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
  ): Promise<NoticeBoard> {
    let query = this.noticeBoardModel.findOne(condition);
    query = projection?.select ? query.select(projection.select) : query;
    this.logger.log('Querying');
    const res = await query.exec();
    this.logger.log('Query successful.');
    return res;
  }

  async findById(
    id: Types.ObjectId,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
    },
  ): Promise<NoticeBoard> {
    let query = this.noticeBoardModel.findById(id);
    query = projection?.select ? query.select(projection.select) : query;
    this.logger.log('Querying');
    const res = await query.exec();
    this.logger.log('Query successful.');
    return res;
  }

  async findAll(projection?: {
    select?: string | Array<string> | Record<string, number | boolean | object>;
    sort?: Record<string, any>;
  }): Promise<NoticeBoard[]> {
    let query = this.noticeBoardModel.find({});
    query = projection?.select
      ? query.select(projection.select)
      : projection?.sort
      ? query.sort(projection.sort)
      : query;
    this.logger.log('Querying');
    const res = await query.exec();
    this.logger.log('Query successful.');
    return res;
  }

  async findAllWhere(
    q: Record<string, any>,
    projection?: {
      select?:
        | string
        | Array<string>
        | Record<string, number | boolean | object>;
      sort?: Record<string, any>;
    },
  ): Promise<NoticeBoard[]> {
    let query = this.noticeBoardModel.find(q);
    query = projection?.select
      ? query.select(projection.select)
      : projection?.sort
      ? query.sort(projection.sort)
      : query;
    this.logger.log('Querying');
    const res = await query.exec();
    this.logger.log('Query successful.');
    return res;
  }

  async create(notice: NoticeDataType): Promise<NoticeBoard> {
    const createdRole = new this.noticeBoardModel(notice);
    return await createdRole.save();
  }

  async findOneAndUpdate(condition: object, document: object) {
    this.logger.log('Querying');
    const res = await this.noticeBoardModel.findOneAndUpdate(
      condition,
      document,
      {
        upsert: true,
        new: true,
      },
    );
    this.logger.log('Query successful.');
    return res;
  }

  async findAndDelete(condition) {
    this.logger.log('Querying');
    const res = await this.noticeBoardModel.findOneAndDelete(condition);
    this.logger.log('Query successful.');
    return res;
  }

  rawModel() {
    return this.noticeBoardModel;
  }
}
