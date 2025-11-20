import { Module } from '@nestjs/common';
import { DemandService } from './demand.service';
import { DemandController } from './demand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Demand } from './entities/demand.entity';
import { Guest } from '../guest/entities/guest.entity';
import { MailModule } from '../../common/services/mail/mail.module';
import { Event } from '../event/entities/event.entity';
import { DemandTableItem } from './entities/demand-table-item.entity';
import { Table } from '../table/entities/table.entity';
import { Payment } from '../payment/entities/payment.entity';

@Module({
  controllers: [DemandController],
  providers: [DemandService],
  imports: [
    MailModule,
    TypeOrmModule.forFeature([Demand, Guest, Event,DemandTableItem,Table,Payment])
  ],
  exports: [DemandService],
})
export class DemandModule {}
