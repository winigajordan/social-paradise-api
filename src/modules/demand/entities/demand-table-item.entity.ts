import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Demand } from './demand.entity';
import { Table } from '../../table/entities/table.entity';

@Entity()
export class DemandTableItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Demand, (demand) => demand.tableItems, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  demand: Demand;

  @ManyToOne(() => Table, (table) => table.demandItems, {
    onDelete: 'RESTRICT',
    nullable: false,
    eager: true, // pratique pour lire directement le type de table
  })
  table: Table;

  @Column({ type: 'int', default: 1 })
  quantity: number;

}
