import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from '../price/entities/price.entity';
import { Event } from './entities/event.entity';
import { Table } from '../table/entities/table.entity';
import { EventExpense } from './entities/event-expense.entity';
import { EventIncome } from './entities/event-income.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Demand } from '../demand/entities/demand.entity';
import { Guest } from '../guest/entities/guest.entity';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [
    TypeOrmModule.forFeature([Event, Price, Table, EventExpense, EventIncome, Payment, Demand, Guest]),
  ],
  exports: [EventService],
})
export class EventModule {}
