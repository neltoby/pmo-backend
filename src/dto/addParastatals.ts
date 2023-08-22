import { IsString, IsNotEmpty } from 'class-validator';

export class AddParastatalsDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
