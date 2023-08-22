import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HASHING } from '../constants';
import { HashAbstractClass } from './hash.abstract';

@Injectable()
export class HashService extends HashAbstractClass {
  constructor(@Inject(HASHING) private hash: typeof bcrypt) {
    super();
  }

  private saltRounds = 10;

  private async generateSalt() {
    try {
      return await this.hash.genSalt(this.saltRounds);
    } catch (e) {
      console.log(e.message);
      throw new Error(e.message);
    }
  }

  async hashing(data: any): Promise<string> {
    return await this.hash.hash(data, this.saltRounds);
  }

  async verifyHash(data: any, hash: string): Promise<boolean> {
    return await this.hash.compare(data, hash);
  }
}
