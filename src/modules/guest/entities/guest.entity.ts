import { Entity, PrimaryGeneratedColumn, Column, Generated, ManyToOne } from 'typeorm';
import { Demand } from '../../demand/entities/demand.entity';

@Entity()
export class Guest {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  age: number;

  @Column()
  @Generated('uuid')
  slug: string;

  @Column({ default: false })
  state: boolean;

  @Column({ default: false })
  isMainGuest: boolean;

  @ManyToOne(() => Demand, demand => demand.guests, { onDelete: 'CASCADE' })
  demand: Demand;

}
