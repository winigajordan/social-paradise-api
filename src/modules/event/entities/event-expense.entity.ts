import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class EventExpense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, event => event.expenses, {
    onDelete: 'CASCADE',
  })
  event: Event;

  @Column()
  label: string;

  @Column({ type: 'float' })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  note?: string;
}

