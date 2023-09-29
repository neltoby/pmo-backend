import { Module, forwardRef } from '@nestjs/common';

import { ParastatalsController } from './parastatals.controller';
import { ParastatalsService } from './parastatals.service';
import { ParastatalsModelModule } from '@model/parastatals/parastatals.model.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfigService } from '@nestjs/config';
import { ParastatalsCategoryModelModule } from '@model/parastatals-category/parastatals-category.model.module';
import { JwtAuthModule } from '@jwt-auth/jwt-auth.module';
import { AppModule } from 'src/app.module';
import { UserModelModule } from '@model/user/user.model.module';

@Module({
  imports: [
    ParastatalsModelModule,
    ParastatalsCategoryModelModule,
    JwtAuthModule,
    UserModelModule,
    forwardRef(() => AppModule),
  ],
  controllers: [ParastatalsController],
  providers: [ParastatalsService, AuthGuard, ConfigService],
})
export class ParastatalsModule {}
