import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Demand } from '../demand/entities/demand.entity';
import { DemandModule } from '../demand/demand.module';
import { DemandService } from '../demand/demand.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [
    TypeOrmModule.forFeature([Payment, Demand]),
    DemandModule,
  ]
})
export class PaymentModule {}
