import { IsString, IsNotEmpty } from 'class-validator';
import { Schema } from 'mongoose';

export class DeleteInviteDto {
  @IsString()
  @IsNotEmpty()
  id: Schema.Types.ObjectId;
}
