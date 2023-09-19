import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';

import { Parastatals } from './schema/parastatals.schema';
import {
  Name,
  ParastatalsCategoryDataType,
  ParastatalsDataType,
  ParastatalsSeed,
  ParastatalsSeedAdjusted,
} from '@interfaces/interfaces';
import { parastatalsWithThemes } from './seeds';
import { MyLoggerService } from '@mylogger/mylogger.service';
import { ParastatalsCategoryModelService } from '@model/parastatals-category/parastatals-category.model.service';

@Injectable()
export class ParastatalsModelService implements OnModuleInit {
  constructor(
    @InjectModel(Parastatals.name)
    private parastatalsModel: Model<Parastatals>,
    private parastatalsCategoryModelService: ParastatalsCategoryModelService,
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
    sort?: Record<string, any>;
  }): Promise<Parastatals[]> {
    let query = this.parastatalsModel.find({});
    query = projection?.select
      ? query.select(projection.select)
      : projection?.sort
      ? query.sort(projection.sort)
      : query;
    return await query.exec();
  }

  async create(parastatal: ParastatalsDataType): Promise<Parastatals> {
    const createdRole = new this.parastatalsModel(parastatal);
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

  async insertMany(list: ParastatalsCategoryDataType[]) {
    return await this.parastatalsModel.insertMany(list);
  }

  rawModel() {
    return this.parastatalsModel;
  }

  async onModuleInit() {
    try {
      const res = await this.parastatalsModel.find({});
      if (!(res.length > 0)) {
        const allParastatalsList = parastatalsWithThemes.map(
          (item: ParastatalsSeed): ParastatalsSeedAdjusted => {
            const newItem: ParastatalsSeedAdjusted = {
              data: [],
              theme: { name: '' },
            };
            newItem.theme = { name: item.theme };
            newItem.data = item.data.map((name) => ({ name }));
            if (item.departments) {
              newItem.departments = item.departments.map((name) => ({
                name,
              }));
            }
            return newItem;
          },
        );
        const insert = await Promise.all(
          allParastatalsList.map(async (item) => {
            const themes = await this.parastatalsCategoryModelService.create(
              item.theme,
            );
            console.log(themes._id);
            const addedId = item.data.map((parastatal) => ({
              category: themes._id as Schema.Types.ObjectId,
              ...parastatal,
            }));
            let themesData;
            if (addedId.length > 1) {
              themesData = await this.insertMany(addedId);
            } else {
              themesData = await this.create(addedId[0]);
            }
            let deptAdded;
            if (item.departments) {
              deptAdded = await this.findOneAndUpdate(
                { _id: themesData._id },
                {
                  $set: { department: item.departments },
                },
              );
              return {
                data: themesData,
                departments: deptAdded,
                theme: themes,
              };
            }
            return { data: themesData, theme: themes };
          }),
        );
        console.log(insert);
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new Error(e.message);
    }
  }
}
