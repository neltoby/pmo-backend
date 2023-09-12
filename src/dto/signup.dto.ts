import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsOptional()
  middlename: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  isHod: boolean;

  @IsString()
  @IsNotEmpty()
  parastatals: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
