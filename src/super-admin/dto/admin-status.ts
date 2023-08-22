import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AdminStatusType } from '@interfaces/interfaces';

export class AdminStatusDto {
  @IsNotEmpty()
  @IsEnum(AdminStatusType)
  status: AdminStatusType;

  @IsNotEmpty()
  @IsString()
  id: string;
}
