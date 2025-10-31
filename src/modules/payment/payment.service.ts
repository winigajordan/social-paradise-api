import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { DemandService } from '../demand/demand.service';
import { DemandStatus } from '../demand/enum/demand-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly demandService: DemandService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const demand = await this.demandService.findOneBySlugWithPayment(
      createPaymentDto.demandSlug,
    );

    if (demand.payment) {
      return new HttpException('Payement already exists', HttpStatus.BAD_REQUEST);
    }

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      demand: demand,
    });

    await this.paymentRepository.save(payment);
    await this.demandService.updateStatus(demand.slug, {
      status: DemandStatus.PAIEMENT_NOTIFIE,
    });

    return;
  }
}
