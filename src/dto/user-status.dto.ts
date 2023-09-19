import { IsString, IsNotEmpty } from 'class-validator';
import { Schema } from 'mongoose';

export class UserStatusDto {
  @IsString()
  @IsNotEmpty()
  parastatal: Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  department?: string;
}
