import { Module } from '@nestjs/common';
import { DemandService } from './demand.service';
import { DemandController } from './demand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Demand } from './entities/demand.entity';
import { Guest } from '../guest/entities/guest.entity';
import { MailModule } from '../../common/services/mail/mail.module';
import { Event } from '../event/entities/event.entity';

@Module({
  controllers: [DemandController],
  providers: [DemandService],
  imports: [
    MailModule,
    TypeOrmModule.forFeature([Demand, Guest, Event])
  ]
})
export class DemandModule {}
