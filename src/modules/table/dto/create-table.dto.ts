import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTableDto {

  @IsNumber()
  amount: number;

  @IsNumber()
  @IsOptional()
  capacity: number;

  @IsString()
  name: string;
}
