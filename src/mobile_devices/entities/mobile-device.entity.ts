import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum UserType {
  Driver = 'Driver',
  Customer = 'Customer',
}

@Entity({ name: 'mobile_devices', schema: 'public' })
@Index(['device_name', 'push_notification_token', 'user_id', 'user_type'], {
  unique: true,
})
export class MobileDevice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  push_notification_token: string;

  @PrimaryColumn()
  device_name: string;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @PrimaryColumn({
    type: 'enum',
    enum: UserType,
  })
  user_type: UserType;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
