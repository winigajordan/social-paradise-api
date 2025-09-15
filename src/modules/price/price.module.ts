import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { EventModule } from '../event/event.module';

@Module({
  controllers: [PriceController],
  providers: [PriceService],
  imports: [
    TypeOrmModule.forFeature([Price]),
    EventModule
  ],
  exports: [PriceService]
})
export class PriceModule {}
