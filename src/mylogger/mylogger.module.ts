import { Global, Module } from '@nestjs/common';
import * as winston from 'winston';
import { MyLoggerService } from './mylogger.service';
import { LOGGER, WINSTON } from '../constants';

@Global()
@Module({
  providers: [
    {
      provide: LOGGER,
      useFactory: (winston) => {
        const { createLogger, format, transports } = winston;
        const { combine, timestamp, label, printf } = format;
        const myFormat = printf(({ level, message, label, timestamp }) => {
          return `${timestamp} [${label}] ${level}: ${message}`;
        });
        return createLogger({
          format: combine(
            label({ label: 'Super Admins:' }),
            timestamp(),
            myFormat,
          ),
          transports: [new transports.Console()],
        });
      },
      inject: [WINSTON],
    },
    {
      provide: WINSTON,
      useFactory: () => winston,
    },
    MyLoggerService,
  ],
  exports: [MyLoggerService],
})
export class MyLoggerModule {}
