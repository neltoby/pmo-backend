import { BankAcctStatus } from '@interfaces/interfaces';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Schema } from 'mongoose';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  department: Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name_of_bank: string;

  @IsNotEmpty()
  @IsString()
  account_no: string;

  @IsNotEmpty()
  @IsString()
  purpose_of_acct: string;

  @IsNotEmpty()
  @IsNumber()
  balance_for_the_day: number;

  @IsNotEmpty()
  @IsNumber()
  cashbook_balance: number;

  @IsNotEmpty()
  @IsEnum([BankAcctStatus.Active, BankAcctStatus.Closed])
  status_of_bank_account: BankAcctStatus;
}
