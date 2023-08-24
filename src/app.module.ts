import { Module } from '@nestjs/common';

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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: validationSchema(5000),
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        console.log(
          `${config.get('mongoUrl')}?authSource=admin&directConnection=true`,
          'line 31',
        );
        console.log(`${config.get('jwtSecret')}`, 'line 33');
        return {
          uri: `${config.get(
            'mongoUrl',
          )}?authSource=admin&directConnection=true`,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
