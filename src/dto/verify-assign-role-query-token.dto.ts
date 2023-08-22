import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAssignRoleQueryToken {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}
