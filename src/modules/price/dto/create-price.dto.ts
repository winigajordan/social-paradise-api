import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreatePriceDto {

  @IsNumber()
  amount: number;

  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

}
