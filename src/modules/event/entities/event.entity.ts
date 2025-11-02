import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Generated
} from 'typeorm';
import { Demand } from '../../demand/entities/demand.entity';
import { Price } from '../../price/entities/price.entity';
import { Table } from '../../table/entities/table.entity';

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

}
