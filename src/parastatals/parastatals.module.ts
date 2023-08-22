import { Module, forwardRef } from '@nestjs/common';

import { ParastatalsController } from './parastatals.controller';
import { ParastatalsService } from './parastatals.service';
import { ParastatalsModelModule } from '@model/parastatals/parastatals.model.module';
import { MyLoggerModule } from '@mylogger/mylogger.module';

@Module({
  imports: [ParastatalsModelModule],
  controllers: [ParastatalsController],
  providers: [ParastatalsService],
})
export class ParastatalsModule {}
