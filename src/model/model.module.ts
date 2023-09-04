import { Module } from '@nestjs/common';

import { UserModelModule } from './user/user.model.module';
import { RolesModelModule } from './roles/roles.model.module';
import { AssignedRoleModelModule } from './assigned-role/assigned-role.model.module';
import { InviteUserModelModule } from './invite-user/inviteuser.model.module';
import { ForgotPasswordModelModule } from './forgot-password/forgot-password.model.module';
import { ParastatalsModelModule } from './parastatals/parastatals.model.module';
import { SenderModelModule } from './sender/sender.model.module';
import { ProjectsModelModule } from './projects/projects.model.module';
import { ParastatalsCategoryModelModule } from './parastatals-category/parastatals-category.model.module';

@Module({
  imports: [
    UserModelModule,
    RolesModelModule,
    AssignedRoleModelModule,
    InviteUserModelModule,
    ForgotPasswordModelModule,
    ParastatalsModelModule,
    ParastatalsCategoryModelModule,
    SenderModelModule,
    ProjectsModelModule,
  ],
  exports: [
    UserModelModule,
    RolesModelModule,
    AssignedRoleModelModule,
    InviteUserModelModule,
    ForgotPasswordModelModule,
    ParastatalsModelModule,
    ParastatalsCategoryModelModule,
    SenderModelModule,
    ProjectsModelModule,
  ],
})
export class ModelModule {}
