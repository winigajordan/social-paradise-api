import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentCanal } from '../enum/payment-canal.enum';
import { PaymentPlace } from '../enum/payment-place';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

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

}
