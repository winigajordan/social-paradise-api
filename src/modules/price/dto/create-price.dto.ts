import { IsDateString, IsNumber } from 'class-validator';

export class CreatePriceDto {

  @IsNumber()
  amount: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

}
