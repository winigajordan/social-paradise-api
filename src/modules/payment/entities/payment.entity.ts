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
import { PaymentPlace } from '../enum/payment-place';

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
      nullable: true,
      type : 'enum',
      enum: PaymentCanal,
    }
  )
  paymentCanal: PaymentCanal;

@Column(
  {
    nullable : true,
    type : 'enum',
    enum: PaymentPlace,
  }
)
paymentPlace: PaymentPlace;



  @OneToOne(() => Demand, demand => demand.payment, { onDelete: 'CASCADE' })
  @JoinColumn()
  demand: Demand;


}
