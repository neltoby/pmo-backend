import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ParastatalsService } from './parastatals.service';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddParastatalsDto } from 'src/dto/addParastatals';
import { AddDepartmentDto } from 'src/dto/addDepartment';
import { GetDepartmentType, Role } from '@interfaces/interfaces';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('parastatals')
export class ParastatalsController {
  constructor(private readonly parastatalsService: ParastatalsService) {}

  // @UseGuards(AuthGuard)
  @Get()
  getAllParastatals() {
    return this.parastatalsService.getAllParastatals();
  }

  // @UseGuards(AuthGuard)
  @Get(':pid')
  getParastatal(@Param('pid') pid: Types.ObjectId) {
    return this.parastatalsService.getParastatals(pid);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @UseGuards(RolesGuard)
  @Post()
  addParastatals(@Body() data: AddParastatalsDto) {
    return this.parastatalsService.addParastatals(data);
  }

  @Get(':pid/department')
  getAllDepartment(@Param('pid') pid: Types.ObjectId) {
    return this.parastatalsService.getAllDepartment(pid);
  }

  @Get(':pid/department/:did')
  getDepartment(@Param() ids: GetDepartmentType) {
    return this.parastatalsService.getDepartment(ids);
  }

  @Post()
  addDepartment(@Body() data: AddDepartmentDto) {
    return this.parastatalsService.addDepartment(data);
  }
}
