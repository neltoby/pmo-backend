import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NoticeBoardService } from './notice-board.service';
import { CreateNoticeBoardDto } from './dto/create-notice-board.dto';
import { UpdateNoticeBoardDto } from './dto/update-notice-board.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role, TokenPayloadInterface } from '@interfaces/interfaces';
import { AuthSignupGuard } from 'src/auth/auth-signup.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Schema, Types, ObjectId } from 'mongoose';

@Controller('notice-board')
export class NoticeBoardController {
  constructor(private readonly noticeBoardService: NoticeBoardService) {}

  @Roles(Role.SuperAdmin, Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthSignupGuard)
  @Post()
  create(@Body() createNoticeBoardDto: CreateNoticeBoardDto, @Request() req) {
    return this.noticeBoardService.create({
      admin_id: (req.user as TokenPayloadInterface).sub,
      ...createNoticeBoardDto,
    });
  }

  @Roles(Role.SuperAdmin, Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthSignupGuard)
  @Get('admin')
  findAll(@Request() req) {
    return this.noticeBoardService.findAll(
      (req.user as TokenPayloadInterface).sub,
    );
  }

  @UseGuards(AuthSignupGuard)
  @Get()
  findOne(@Request() req) {
    return this.noticeBoardService.findOne(
      (req.user as TokenPayloadInterface).sub,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoticeBoardDto: UpdateNoticeBoardDto,
  ) {
    return this.noticeBoardService.update(+id, updateNoticeBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noticeBoardService.remove(+id);
  }
}
