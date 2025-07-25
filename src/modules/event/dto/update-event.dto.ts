import { IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePriceDto } from '../../price/dto/create-price.dto';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePriceDto)
  prices?: (CreatePriceDto & { id?: number })[];
}
