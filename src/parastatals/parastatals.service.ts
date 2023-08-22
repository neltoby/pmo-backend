import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  AddDepartmentType,
  GetDepartmentType,
  ParastatalsType,
} from '@interfaces/interfaces';
import { ParastatalsModelService } from '@model/parastatals/parastatals.model.service';
import { MyLoggerService } from '@mylogger/mylogger.service';
import { APP_ERROR } from 'src/constants';

@Injectable()
export class ParastatalsService {
  constructor(
    private parastatalsModelService: ParastatalsModelService,
    private logger: MyLoggerService,
  ) {}

  async getAllParastatals() {
    let res;
    try {
      res = this.parastatalsModelService.findAll({ select: 'name' });
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { data: res.toObject() };
  }

  async getParastatals(_id: Types.ObjectId) {
    let res;
    try {
      res = this.parastatalsModelService.findById(_id, { select: 'name' });
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { ...res.toObject() };
  }

  async addParastatals(data: ParastatalsType) {
    let res;
    try {
      res = this.parastatalsModelService.create({ name: data.name });
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { ...res.toObject() };
  }

  async getAllDepartment(pid: Types.ObjectId) {
    let res;
    try {
      res = this.parastatalsModelService.findOne({ _id: pid });
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { data: res.toObject() };
    return {};
  }

  async getDepartment({ pid, did }: GetDepartmentType) {
    let res;
    try {
      res = this.parastatalsModelService.findOne(
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
    return { ...res.toObject() };
  }

  async addDepartment({ name, pid }: AddDepartmentType) {
    let res;
    try {
      res = this.parastatalsModelService.findOneAndUpdate(
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
    return { ...res.toObject() };
  }
}
