import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyInviteDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
