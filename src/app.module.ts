import { Module, forwardRef } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { MyLoggerModule } from './mylogger/mylogger.module';
import { validationSchema } from './validation/validationSchema';
import { ModelModule } from '@model/model.module';
import { HashModule } from '@hash/hash.module';
import { JwtAuthModule } from '@jwt-auth/jwt-auth.module';
import { NotificationQueueModule } from './notification-queue/notification-queue.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { ParastatalsModule } from './parastatals/parastatals.module';
import { ProjectsModule } from './projects/projects.module';
import { NoticeBoardModule } from './notice-board/notice-board.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema(5000),
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          uri: `${config.get('mongoUrl')}`,
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        console.log('process.cwd(): ', process.cwd());
        console.log('__dirname: ', __dirname);
        return {
          redis: {
            host: config.get('redisHost'),
            port: config.get('redisPort'),
            password: config.get('redisPassword'),
          },
        };
      },
      inject: [ConfigService],
    }),
    SuperAdminModule,
    MyLoggerModule,
    ModelModule,
    JwtAuthModule,
    HashModule,
    NotificationQueueModule,
    ParastatalsModule,
    ProjectsModule,
    forwardRef(() => NoticeBoardModule),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
