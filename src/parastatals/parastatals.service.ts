import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Schema } from 'mongoose';
import {
  AddDepartmentType,
  GetDepartmentType,
  ParastatalsType,
} from '@interfaces/interfaces';
import { ParastatalsModelService } from '@model/parastatals/parastatals.model.service';
import { MyLoggerService } from '@mylogger/mylogger.service';
import { APP_ERROR } from 'src/constants';
import { ParastatalsCategoryModelService } from '@model/parastatals-category/parastatals-category.model.service';
import { AppService } from 'src/app.service';

@Injectable()
export class ParastatalsService {
  constructor(
    private appService: AppService,
    private parastatalsModelService: ParastatalsModelService,
    private parastatalsCategoryModelService: ParastatalsCategoryModelService,
    private logger: MyLoggerService,
  ) {}

  async getAllParastatals(themes = false) {
    let res;
    if (themes) {
      try {
        res = await this.parastatalsCategoryModelService.rawModel().aggregate([
          {
            $lookup: {
              from: 'parastatals',
              localField: '_id',
              foreignField: 'category',
              as: 'parastatals',
            },
          },
          {
            $project: {
              updatedAt: 0,
              createdAt: 0,
              __v: 0,
              'parastatals.updatedAt': 0,
              'parastatals.createdAt': 0,
              'parastatals.__v': 0,
            },
          },
        ]);
      } catch (e) {
        this.logger.error(e.message);
        throw new HttpException(
          { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      try {
        res = await this.parastatalsModelService.findAll({
          select: '_id category name department',
          sort: { name: '1' },
        });
      } catch (e) {
        this.logger.error(e.message);
        throw new HttpException(
          { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return res;
  }

  async getParastatals(_id: Schema.Types.ObjectId) {
    let res;
    try {
      res = await this.parastatalsModelService.findOne(
        { _id },
        {
          select: 'name department',
        },
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (res) return { ...res._doc };
    return {};
  }

  async addParastatals(data: ParastatalsType) {
    let res;
    try {
      res = await this.parastatalsModelService.create({
        name: data.name,
        category: data.category,
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { ...res._doc };
  }

  async getAllDepartment(pid: Schema.Types.ObjectId) {
    let res;
    try {
      res = await this.parastatalsModelService.findOne({ _id: pid });
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { data: res._doc };
    return {};
  }

  async getDepartment({ pid, did }: GetDepartmentType) {
    let res;
    try {
      res = await this.parastatalsModelService.findOne(
        { _id: pid, 'department._id': did },
        { select: 'name department.name' },
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { ...res._doc };
  }

  async addDepartment({ name, pid }: AddDepartmentType) {
    let res;
    try {
      res = await this.parastatalsModelService.findOneAndUpdate(
        { _id: pid },
        { $push: { department: { name } } },
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { ...res._doc };
  }

  async getDefaultDepartment(id: Schema.Types.ObjectId) {
    console.log('i was called with: ', id);
    const user = await this.appService.getUser(id);
    console.log(user, user.parastatal, 'line 161');
    const dept = await this.getParastatals(user.parastatal);
    console.log(dept, 'line 163');
    return dept;
  }
}
