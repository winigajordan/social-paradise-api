import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePriceDto } from '../../price/dto/create-price.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTableDto } from '../../table/dto/create-table.dto';
import { PaymentCanal } from '../../payment/enum/payment-canal.enum';
import { CashPlaceDto, PaymentMethodDto } from './create-event.dto';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Localisation' })
  location?: string

  @IsString()
  @ApiProperty({ example: 'Description' })
  @IsOptional()
  description?: string;

  @IsUrl()
  @ApiProperty({ example: 'Description' })
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ example: true, required: false, description: 'Événement actif (demandes ouvertes)' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 0, required: false, description: 'Solde initial de l’événement' })
  @IsOptional()
  initialBalance?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePriceDto)
  prices?: (CreatePriceDto & { id?: number })[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTableDto)
  tables?: (CreateTableDto & { id?: number })[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  @IsArray()
  @ApiProperty({ isArray: true, type: PaymentMethodDto, required: false })
  paymentMethods?: PaymentMethodDto[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  allowCash?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CashPlaceDto)
  @IsArray()
  @ApiProperty({ isArray: true, type: CashPlaceDto, required: false })
  cashPlacesConfig?: CashPlaceDto[];

}
