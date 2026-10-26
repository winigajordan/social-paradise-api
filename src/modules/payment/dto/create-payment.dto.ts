import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentCanal } from '../enum/payment-canal.enum';
import { PaymentPlace } from '../enum/payment-place';

// Pas de champ "amount" : le montant est calculé par le serveur
export class CreatePaymentDto {
  @IsString()
  @IsOptional()
  phoneNumber : string;

  @IsEnum(PaymentCanal)
  paymentCanal: PaymentCanal;

  @IsOptional()
  @IsEnum(PaymentPlace)
  paymentPlace: PaymentPlace;

  @IsUUID()
  demandSlug: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceId?: number;

}
