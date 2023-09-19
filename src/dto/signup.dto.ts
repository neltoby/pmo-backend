import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';
import { Schema } from 'mongoose';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsOptional()
  middlename?: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  is_hod: boolean;

  @IsString()
  @IsNotEmpty()
  parastatal: Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  password: string;
}
