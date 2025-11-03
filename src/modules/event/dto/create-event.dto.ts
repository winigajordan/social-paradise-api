import {
  IsDateString,
  IsString,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePriceDto } from '../../price/dto/create-price.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTableDto } from '../../table/dto/create-table.dto';

export class CreateEventDto {

  @IsString()
  @ApiProperty({ example: 'Nom de l\'evenement' })
  name: string;

  @IsDateString()
  @ApiProperty({ example: '2025-12-31' })
  date: string;

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


  @ValidateNested({ each: true })
  @Type(() => CreatePriceDto)
  @ArrayMinSize(1)
  @ApiProperty({ isArray: true })
  prices: CreatePriceDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateTableDto)
  @ApiProperty({ isArray: true })
  @IsOptional()
  tables: CreateTableDto[];

}
