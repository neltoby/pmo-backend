import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ParastatalsService } from './parastatals.service';
import { Schema } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddParastatalsDto } from 'src/dto/addParastatals';
import { AddDepartmentDto } from 'src/dto/addDepartment';
import {
  GetDepartmentType,
  Role,
  TokenPayloadInterface,
} from '@interfaces/interfaces';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiParam } from '@nestjs/swagger';
import { AuthSignupGuard } from 'src/auth/auth-signup.guard';

@Controller('parastatals')
export class ParastatalsController {
  constructor(private readonly parastatalsService: ParastatalsService) {}

  // @UseGuards(AuthGuard)
  @Get()
  getAllParastatals(@Query('themes', ParseBoolPipe) themes = true) {
    return this.parastatalsService.getAllParastatals(themes);
  }

  // @UseGuards(AuthGuard)

  @UseGuards(AuthSignupGuard)
  @Roles(Role.SuperAdmin, Role.Admin)
  @UseGuards(RolesGuard)
  @Post()
  addParastatals(@Body() data: AddParastatalsDto) {
    return this.parastatalsService.addParastatals(data);
  }

  @Get(':pid/department')
  getAllDepartment(@Param('pid') pid: Schema.Types.ObjectId) {
    return this.parastatalsService.getAllDepartment(pid);
  }

  @Get(':pid/department/:did')
  getDepartment(@Param() ids: GetDepartmentType) {
    return this.parastatalsService.getDepartment(ids);
  }

  @Post('department')
  addDepartment(@Body() data: AddDepartmentDto) {
    console.log(data, 'line 65');
    return this.parastatalsService.addDepartment(data);
  }

  @UseGuards(AuthSignupGuard)
  @Get('department')
  getDefaultDepartment(@Request() req) {
    return this.parastatalsService.getDefaultDepartment(
      (req.user as TokenPayloadInterface).sub,
    );
  }

  @Get(':pid')
  @ApiParam({
    name: 'parastatalId',
    required: true,
    description: 'A mongodb schema type objectId',
    schema: { type: 'string' },
  })
  getParastatal(@Param('pid') pid: Schema.Types.ObjectId) {
    console.log(pid);
    return this.parastatalsService.getParastatals(pid);
  }
}
