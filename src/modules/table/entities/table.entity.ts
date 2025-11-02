import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { Event } from '../../event/entities/event.entity';

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

  @ManyToOne(() => Event, event => event.prices, { onDelete: 'CASCADE' })
  event: Event;
}
