import {
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePriceDto } from '../../price/dto/create-price.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTableDto } from '../../table/dto/create-table.dto';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsString()
  @ApiProperty({ example: 'Localisation' })
  location : string

  @IsString()
  @ApiProperty({ example: 'Description' })
  @IsOptional()
  description : string;

  @IsUrl()
  @ApiProperty({ example: 'Description' })
  @IsOptional()
  coverImage : string;


  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePriceDto)
  prices?: (CreatePriceDto & { id?: number })[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTableDto)
  tables?: (CreateTableDto & { id?: number })[];

}
