import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Demand } from '../../demand/entities/demand.entity';
import { PaymentCanal } from '../enum/payment-canal.enum';

@Entity()
export class Payment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @CreateDateColumn()
  date: Date;

  @Column()
  phoneNumber: string;

  @Column(
    {
      type : 'enum',
      enum: PaymentCanal,
      default: PaymentCanal.CASH,
    }
  )
  paymentCanal: PaymentCanal;



  @ManyToOne(() => Demand, demand => demand.payments, { onDelete: 'CASCADE' })
  demand: Demand;


}
