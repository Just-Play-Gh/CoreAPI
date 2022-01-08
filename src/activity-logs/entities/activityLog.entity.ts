import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'activity_logs', schema: 'public' })
export class Tax extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 18 })
  user: string;

  @Column({ type: 'text' })
  naration: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
