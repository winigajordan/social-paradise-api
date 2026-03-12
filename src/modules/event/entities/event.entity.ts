import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Generated,
} from 'typeorm';
import { Demand } from '../../demand/entities/demand.entity';
import { Price } from '../../price/entities/price.entity';
import { Table } from '../../table/entities/table.entity';
import { PaymentCanal } from '../../payment/enum/payment-canal.enum';
import { EventExpense } from '../entities/event-expense.entity';
import { EventIncome } from '../entities/event-income.entity';

@Entity()
export class Event {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  @Generated('uuid')
  slug: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Demand, demand => demand.event)
  demands: Demand[];

  @OneToMany(() => Price, price => price.event, { cascade: true })
  prices: Price[];

  @OneToMany(() => Table, table => table.event, { cascade: true })
  tables: Table[];

  @Column({
    type: 'float',
    default: 0,
  })
  initialBalance: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  paymentMethods?: {
    name: string;
    phoneNumber: string;
    canal?: PaymentCanal | string;
  }[];

  @Column({
    default: true,
  })
  allowCash: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  cashPlacesConfig?: {
    name: string;
    address: string;
    mapUrl?: string;
  }[];

  @OneToMany(() => EventExpense, expense => expense.event, { cascade: true })
  expenses: EventExpense[];

  @OneToMany(() => EventIncome, income => income.event, { cascade: true })
  incomes: EventIncome[];

}
