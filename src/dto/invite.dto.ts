import { Role } from '@interfaces/interfaces';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Schema } from 'mongoose';

export class InviteDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsOptional()
  parastatals: Schema.Types.ObjectId;

  @IsString()
  @IsOptional()
  department?: Schema.Types.ObjectId;
}
