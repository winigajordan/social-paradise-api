import { Column, CreateDateColumn, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DemandStatus } from '../enum/demand-status.enum';
import { Guest } from '../../guest/entities/guest.entity';
import { Event } from '../../event/entities/event.entity';
import { DemandType } from '../enum/demand-type.enum';

@Entity()
export class Demand {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Generated('uuid')
  slug : string;

  @Column({
    type: 'enum',
    enum: DemandStatus,
    default : DemandStatus.SOUMISE,
  })
  status : DemandStatus;


  @Column({
    type: 'enum',
    enum: DemandType,
    default : DemandType.INIQUE,
  })
  type : DemandType


  @OneToMany(() => Guest, guest => guest.demand, { cascade: true })
  guests: Guest[];

  @ManyToOne(() => Event, event => event.demands, { onDelete: 'SET NULL', nullable: true })
  event: Event;



}
