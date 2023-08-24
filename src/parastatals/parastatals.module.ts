import { Module, forwardRef } from '@nestjs/common';

import { ParastatalsController } from './parastatals.controller';
import { ParastatalsService } from './parastatals.service';
import { ParastatalsModelModule } from '@model/parastatals/parastatals.model.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ParastatalsModelModule],
  controllers: [ParastatalsController],
  providers: [ParastatalsService, AuthGuard, JwtService, ConfigService],
})
export class ParastatalsModule {}
