import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@interfaces/interfaces';

export class RoleAssigned {
  @IsString()
  @IsNotEmpty()
  role: Role;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  parastatals: string;

  @IsNotEmpty()
  @IsString()
  department: string;
}
