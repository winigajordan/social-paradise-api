import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { DemandService } from '../demand/demand.service';
import { Demand } from '../demand/entities/demand.entity';

@Injectable()
export class PaymentService {


  constructor(
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    private readonly demandService: DemandService,
  ) {
  }


  async create(createPaymentDto: CreatePaymentDto) {

    const demand : Demand = await this.demandService.findOneBySlug(createPaymentDto.demandSlug)





  }


}
