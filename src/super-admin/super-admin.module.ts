import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminController } from './super-admin.controller';
import { JwtAuthModule } from '@jwt-auth/jwt-auth.module';
import { HashModule } from '@hash/hash.module';
import { NotificationQueueModule } from 'src/notification-queue/notification-queue.module';
import { SuperAdminModelModule } from './model/model.module';

@Module({
  controllers: [SuperAdminController],
  imports: [
    SuperAdminModelModule,
    JwtAuthModule,
    HashModule,
    NotificationQueueModule,
  ],
  providers: [SuperAdminService],
})
export class SuperAdminModule {}
