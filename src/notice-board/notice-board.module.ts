import { Module, forwardRef } from '@nestjs/common';
import { NoticeBoardService } from './notice-board.service';
import { NoticeBoardController } from './notice-board.controller';
import { AppModule } from 'src/app.module';
import { UserModelModule } from '@model/user/user.model.module';
import { NotificationQueueModule } from 'src/notification-queue/notification-queue.module';
import { NoticeBoardModelModule } from '@model/notice-board/notice-board.model.module';
import { JwtAuthModule } from '@jwt-auth/jwt-auth.module';

@Module({
  imports: [
    NoticeBoardModelModule,
    forwardRef(() => AppModule),
    JwtAuthModule,
    UserModelModule,
    NotificationQueueModule,
  ],
  controllers: [NoticeBoardController],
  providers: [NoticeBoardService],
})
export class NoticeBoardModule {}
