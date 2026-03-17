import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateDemandDiscountDto {
  @ApiProperty({ example: 5000, description: 'Montant de la remise en FCFA' })
  @IsNumber()
  @Min(0)
  discountAmount: number;
}

