import { IsString, IsNotEmpty } from 'class-validator';
import { Schema } from 'mongoose';

export class AddParastatalsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: Schema.Types.ObjectId;
}
