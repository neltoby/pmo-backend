import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { LOGGER } from '../constants';

@Injectable()
export class MyLoggerService implements LoggerService {
  constructor(@Inject(LOGGER) private logger) {}

  log(message: any) {
    this.logger.log('info', message);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any) {
    this.logger.error(message);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any) {
    this.logger.warn(message);
  }
}
