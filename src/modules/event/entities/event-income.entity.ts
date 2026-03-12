import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class EventIncome {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, event => event.incomes, {
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

