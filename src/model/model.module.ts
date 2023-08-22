import { Module } from '@nestjs/common';

import { UserModelModule } from './user/user.model.module';
import { RolesModelModule } from './roles/roles.model.module';
import { AssignedRoleModelModule } from './assigned-role/assigned-role.model.module';
import { InviteUserModelModule } from './invite-user/inviteuser.model.module';
import { ForgotPasswordModelModule } from './forgot-password/forgot-password.model.module';
import { ParastatalsModelModule } from './parastatals/parastatals.model.module';
import { SenderModelModule } from './sender/sender.model.module';

@Module({
  imports: [
    UserModelModule,
    RolesModelModule,
    AssignedRoleModelModule,
    InviteUserModelModule,
    ForgotPasswordModelModule,
    ParastatalsModelModule,
    SenderModelModule,
  ],
  exports: [
    UserModelModule,
    RolesModelModule,
    AssignedRoleModelModule,
    InviteUserModelModule,
    ForgotPasswordModelModule,
    ParastatalsModelModule,
    SenderModelModule,
  ],
})
export class ModelModule {}
