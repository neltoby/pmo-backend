/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { EmailOptions } from '@interfaces/interfaces';

export abstract class EmailServiceAbstract {
  abstract sendEmail(emailOptions: EmailOptions): unknown;
}
