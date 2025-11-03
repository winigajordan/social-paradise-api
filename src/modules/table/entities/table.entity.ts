import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne, OneToMany,
} from 'typeorm';
import { Event } from '../../event/entities/event.entity';
import { DemandTableItem } from '../../demand/entities/demand-table-item.entity';

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  capacity: number;

  @ManyToOne(() => Event, event => event.tables, { onDelete: 'CASCADE' })
  event: Event;

  @OneToMany(() => DemandTableItem, (item) => item.table)
  demandItems: DemandTableItem[];
}
