import { Order } from 'src/order/entities/order.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DeviceType {
  Vehicle = 'vehicle',
  Generator = 'generator',
  HeavyDuty = 'heavy_duty',
}

@Entity({ name: 'devices', schema: 'public' })
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  fuelType: string;

  @Column()
  customerId: number;
  @Column()
  productId: number;

  @Column()
  alias: string;

  @Column({
    type: 'enum',
    enum: DeviceType,
    default: DeviceType.Vehicle,
  })
  type: DeviceType;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @DeleteDateColumn()
  deleted: Date;

  @OneToOne(() => Order)
  @JoinColumn({ referencedColumnName: 'device' })
  order: Order;
  // @ManyToOne(() => Order, (order) => order.device)
  // @JoinColumn({ name: 'id' })
  // order: Order;
}
