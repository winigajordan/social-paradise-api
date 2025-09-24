import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @Column({nullable : true})
  phoneNumber: string;

  @Column(
    {
      type : 'enum',
      enum: PaymentCanal,
      default: PaymentCanal.CASH,
    }
  )
  paymentCanal: PaymentCanal;



  @OneToOne(() => Demand, demand => demand.payment, { onDelete: 'CASCADE' })
  @JoinColumn()
  demand: Demand;


}
