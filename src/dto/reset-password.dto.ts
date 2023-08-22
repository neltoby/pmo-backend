import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { Schema } from 'mongoose';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  id: Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirm_password: string;
}
