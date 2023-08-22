import { IsNotEmpty, IsString } from 'class-validator';

export class SigninSuperAdminDto {
  @IsString()
  @IsNotEmpty()
  request_id: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
