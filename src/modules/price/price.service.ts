import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { Repository } from 'typeorm';
import { EventService } from '../event/event.service';
import { CreatePriceDto } from './dto/create-price.dto';

@Injectable()
export class PriceService {

  constructor(
      @InjectRepository(Price) private readonly priceRepository: Repository<Price>,
      private readonly eventService: EventService
  ) {
  }

  async create(dto : CreatePriceDto) {
    // const event = await this.eventService.findOneBySlug(dto.eventSlug);
    //
    // const createdPrice = this.priceRepository.create({
    //   ...dto,
    //   event : event,
    // });
    //
    // return await this.priceRepository.save(createdPrice);

  }

}
