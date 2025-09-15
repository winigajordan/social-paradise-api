import { IsEnum, IsNumber, IsSemVer, IsString, IsUUID } from 'class-validator';
import { PaymentCanal } from '../enum/payment-canal.enum';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  phoneNumber : string;

  @IsEnum(PaymentCanal)
  canal: PaymentCanal;

  @IsUUID()
  demandSlug: string;

}
