import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

// import { ParastatalsDataType } from '@interfaces/interfaces';
import { Parastatals, ParastatalsDocument } from './schema/parastatals.schema';
import { ParastatalsDataType } from '@interfaces/interfaces';
import {
  parastatalsListBeginningWithLagos,
  parastatalsListWithoutLagos,
} from './seeds';
import { MyLoggerService } from '@mylogger/mylogger.service';

@Injectable()
export class ParastatalsModelService implements OnModuleInit {
  constructor(
    @InjectModel(Parastatals.name)
    private parastatalsModel: Model<Parastatals>,
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
  ): Promise<Parastatals> {
    let query = this.parastatalsModel.findOne(condition);
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
  ): Promise<Parastatals> {
    let query = this.parastatalsModel.findById(id);
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async findAll(projection?: {
    select?: string | Array<string> | Record<string, number | boolean | object>;
  }): Promise<Parastatals[]> {
    let query = this.parastatalsModel.find({});
    query = projection?.select ? query.select(projection.select) : query;
    return await query.exec();
  }

  async create(invite: ParastatalsDataType): Promise<Parastatals> {
    const createdRole = new this.parastatalsModel(invite);
    return await createdRole.save();
  }

  async findOneAndUpdate(condition: object, document: object) {
    return await this.parastatalsModel.findOneAndUpdate(condition, document, {
      upsert: true,
      new: true,
    });
  }

  async findAndDelete(condition) {
    return await this.parastatalsModel.findOneAndDelete(condition);
  }

  async onModuleInit() {
    try {
      const res = await this.parastatalsModel.find({});
      if (!(res.length > 0)) {
        const withLagos: Array<string> = parastatalsListBeginningWithLagos.map(
          (item) => `Lagos State ${item}`,
        );
        const allParastatalsList: Array<{ name: string }> = [
          ...withLagos,
          ...parastatalsListWithoutLagos,
        ].map((item) => ({ name: item }));
        this.parastatalsModel.insertMany(allParastatalsList);
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new Error(e.message);
    }
  }
}
