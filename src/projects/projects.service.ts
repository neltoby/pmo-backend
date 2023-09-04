import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsModelService } from '@model/projects/projects.model.service';
import {
  CreateProjects,
  CreateProjectsRetuenType,
  FindAllDepartmentType,
} from '@interfaces/interfaces';
import { APP_ERROR } from 'src/constants';
import { MyLoggerService } from '@mylogger/mylogger.service';
import { Schema } from 'mongoose';
import { UserModelService } from '@model/user/user.model.service';

@Injectable()
export class ProjectsService {
  constructor(
    private projectsmodelService: ProjectsModelService,
    private usermodelService: UserModelService,
    private logger: MyLoggerService,
  ) {}

  async isUserInDepartment({
    id,
    department,
  }: {
    id: Schema.Types.ObjectId;
    department: Schema.Types.ObjectId;
  }) {
    let user;
    try {
      user = await this.usermodelService.findOne({ _id: id });
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: APP_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    console.log(user);
    const userDetails = (user as any)._doc;
    console.log(userDetails);
    if (userDetails.department._id === department) {
      return true;
    }
    return false;
  }

  async create(
    createProjects: CreateProjects,
  ): Promise<CreateProjectsRetuenType> {
    const { details, department } = createProjects;
    if (await this.isUserInDepartment({ id: details.user, department })) {
      if (Object.keys(details).length > 0) {
        let projects;
        try {
          projects = await this.projectsmodelService.findOneAndUpdate(
            { department },
            { $push: details },
            { upsert: true, new: true },
          );
        } catch (e) {
          this.logger.error(`Failed to create Project::: ${e.message}`);
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: APP_ERROR,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        const proj = projects;
        return { ...proj };
      }
      this.logger.error(`Invalid project object. Projects can not be empty.`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Projects can not be empty',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    this.logger.error(
      'You currently do not have the privilege to create a project here',
    );
    throw new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Do not have the right to this department',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  isDateCheck({ start_date, end_date }) {
    if (start_date) {
      if (end_date) {
        if (new Date(start_date).getTime() > new Date(end_date).getTime()) {
          this.logger.error(`Start end should lesser than end start`);
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: 'Start end should lesser than end start',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        return { start_date, end_date };
      }
      return { start_date };
    } else if (end_date) {
      return { end_date };
    }
    this.logger.error(`Start date and end Dte cannot be empty.`);
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Start date and end Dte cannot be empty.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async findByDepartment(id: string, query: FindAllDepartmentType) {
    if (Object.keys(query).length > 0) {
      const checkdate = this.isDateCheck({
        start_date: query.start_date,
        end_date: query.end_date,
      });
      if (checkdate.start_date && checkdate.end_date) {
        let res;
        try {
          res = await this.projectsmodelService.findWithAggregations([
            {
              $match: {
                'details.updatedAt': {
                  $gt: new Date(query.start_date).toISOString(),
                  $lt: new Date(query.end_date).toISOString(),
                },
              },
            },
            {
              $group: {
                _id: '$department',
                amount: { $sum: '$details.balance_for_the_day' },
              },
            },
          ]);
        } catch (e) {
          this.logger.error(`Query failed. ::: ${e.message}`);
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: 'Projects can not be empty',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return res;
      } else if (
        (checkdate.start_date && !checkdate.end_date) ||
        (checkdate.end_date && !checkdate.start_date)
      ) {
        const getdate = checkdate.start_date || checkdate.end_date;
        let res;
        try {
          res = await this.projectsmodelService.findWithAggregations([
            {
              $match: {
                'details.updatedAt': getdate,
              },
            },
            {
              $group: {
                _id: '$department',
                amount: { $sum: '$details.balance_for_the_day' },
              },
            },
          ]);
        } catch (e) {
          this.logger.error(`Query failed. ::: ${e.message}`);
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: 'Projects can not be empty',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return res;
      }
    }
    this.logger.error(`Query object can not be empty.`);
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Query object can not be empty.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async findAll(query: FindAllDepartmentType) {
    if (Object.keys(query).length > 0) {
      const checkdate = this.isDateCheck({
        start_date: query.start_date,
        end_date: query.end_date,
      });
      if (checkdate.start_date && checkdate.end_date) {
        let res;
        try {
          res = await this.projectsmodelService.findWithAggregations([
            {
              $match: {
                'details.updatedAt': {
                  $gt: new Date(query.start_date).toISOString(),
                  $lt: new Date(query.end_date).toISOString(),
                },
              },
            },
            {
              $group: {
                _id: '$department',
                amount: { $sum: '$details.balance_for_the_day' },
              },
            },
          ]);
        } catch (e) {
          this.logger.error(`Query failed. ::: ${e.message}`);
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: 'Projects can not be empty',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return res;
      } else if (
        (checkdate.start_date && !checkdate.end_date) ||
        (checkdate.end_date && !checkdate.start_date)
      ) {
        const getdate = checkdate.start_date || checkdate.end_date;
        let res;
        try {
          res = await this.projectsmodelService.findWithAggregations([
            {
              $match: {
                'details.updatedAt': getdate,
              },
            },
            {
              $group: {
                _id: '$department',
                amount: { $sum: '$details.balance_for_the_day' },
              },
            },
          ]);
        } catch (e) {
          this.logger.error(`Query failed. ::: ${e.message}`);
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: 'Projects can not be empty',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return res;
      }
    }
    this.logger.error(`Query object can not be empty.`);
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Query object can not be empty.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
