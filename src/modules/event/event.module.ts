import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from '../price/entities/price.entity';
import { Event } from './entities/event.entity';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [
    TypeOrmModule.forFeature([Event, Price]),
  ],
  exports: [EventService],
})
export class EventModule {}
