import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { TableService } from './table.service';

@Module({
  controllers : [TableController],
  providers: [],
  imports: [
    TypeOrmModule.forFeature([Table]),
    TableModule
  ],
  exports: [TableService]
})
export class TableModule {}
