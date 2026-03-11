import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePriceDto } from '../../price/dto/create-price.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTableDto } from '../../table/dto/create-table.dto';
import { PaymentCanal } from '../../payment/enum/payment-canal.enum';

export class PaymentMethodDto {
  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(PaymentCanal)
  canal?: PaymentCanal;
}

export class CashPlaceDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsUrl()
  mapUrl?: string;
}

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

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  @IsArray()
  @ApiProperty({ isArray: true, type: PaymentMethodDto, required: false })
  paymentMethods?: PaymentMethodDto[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: true })
  allowCash?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CashPlaceDto)
  @IsArray()
  @ApiProperty({ isArray: true, type: CashPlaceDto, required: false })
  cashPlacesConfig?: CashPlaceDto[];

}
