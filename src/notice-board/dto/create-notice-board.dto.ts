import { NoticeMessageBy, NoticeMessageTo } from '@interfaces/interfaces';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Schema } from 'mongoose';

export class CreateNoticeBoardDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  to: NoticeMessageTo;

  @IsString()
  @IsNotEmpty()
  by: NoticeMessageBy;

  @IsString()
  @IsEmail()
  to_user?: string;

  @IsArray()
  to_parastatal?: Schema.Types.ObjectId[];
}
