import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Demand } from '../demand/entities/demand.entity';
import { Guest } from './entities/guest.entity';

@Module({
  controllers: [GuestController],
  providers: [GuestService],
  imports: [
    TypeOrmModule.forFeature([Demand, Guest])
  ]
})
export class GuestModule {}
