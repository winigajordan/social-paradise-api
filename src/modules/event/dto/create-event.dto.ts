import { IsDateString, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePriceDto } from '../../price/dto/create-price.dto';

export class CreateEventDto {

  @IsString()
  name: string;

  @IsDateString()
  date: string;

  @ValidateNested({ each: true })
  @Type(() => CreatePriceDto)
  @ArrayMinSize(1)
  prices: CreatePriceDto[];

}
