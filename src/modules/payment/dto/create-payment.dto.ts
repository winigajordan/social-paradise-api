import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentCanal } from '../enum/payment-canal.enum';
import { IsNull } from 'typeorm';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  phoneNumber : string;

  @IsEnum(PaymentCanal)
  paymentCanal: PaymentCanal;

  @IsUUID()
  demandSlug: string;

}
