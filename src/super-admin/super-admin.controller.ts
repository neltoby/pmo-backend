import { Controller, Post, Body, UseGuards, Query, Get } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { SigninSuperAdminDto } from './dto/signin-super-admin.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SuperAdminVerificationData } from '@interfaces/interfaces';
import { AdminStatusDto } from './dto/admin-status';

@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('create')
  createSuperUser(@Body() createSuperAdminDto: CreateSuperAdminDto) {
    return this.superAdminService.createSuperUser(createSuperAdminDto);
  }

  @Post('signin')
  signinSuperAdmin(@Body() user: SigninSuperAdminDto) {
    return this.superAdminService.signinSuperAdmin(user);
  }

  @Get('verify-admin')
  verifyAdmin(
    @Query('token') token: string,
  ): Promise<SuperAdminVerificationData> {
    return this.superAdminService.verifyAdmin(token);
  }

  @Post('admin-status')
  adminStatus(@Body() data: AdminStatusDto) {
    return this.superAdminService.adminStatus(data);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSuperAdminDto: UpdateSuperAdminDto,
  // ) {
  //   return this.superAdminService.update(+id, updateSuperAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.superAdminService.remove(+id);
  // }
}
