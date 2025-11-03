import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';

@Injectable()
export class TableService {

  constructor(
    @InjectRepository(Table) private readonly priceRepository: Repository<Table>,
  ) {
  }

}