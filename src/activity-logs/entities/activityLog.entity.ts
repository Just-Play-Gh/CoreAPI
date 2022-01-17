import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'activity_logs', schema: 'public' })
export class ActivityLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('activity_log_log_name_index')
  @Column({ length: 18 })
  logName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 40 })
  subjectId: string;

  @Column({ length: 20 })
  subjectType: string;

  @Column({ length: 40 })
  causerId: string;

  @Column({ length: 20 })
  causerType: string;

  @Column({ type: 'text' })
  properties: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
