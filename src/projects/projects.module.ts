import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UserModelModule } from '@model/user/user.model.module';
import { ProjectsModelModule } from '@model/projects/projects.model.module';
import { JwtAuthModule } from '@jwt-auth/jwt-auth.module';

@Module({
  imports: [UserModelModule, ProjectsModelModule, JwtAuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
