import { Verified } from '@interfaces/interfaces';
import { IsString, IsNotEmpty } from 'class-validator';
import { Schema } from 'mongoose';

export class VerifyUserDto {
  @IsString()
  @IsNotEmpty()
  userId: Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  status: Verified;
}
