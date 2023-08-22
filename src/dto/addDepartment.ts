import { IsString, IsNotEmpty } from 'class-validator';
import { AddParastatalsDto } from './addParastatals';
import { Schema } from 'mongoose';

export class AddDepartmentDto extends AddParastatalsDto {
  @IsString()
  @IsNotEmpty()
  pid: Schema.Types.ObjectId;
}
