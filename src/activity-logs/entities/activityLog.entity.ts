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
  @Column({ length: 50 })
  logName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  subjectId: unknown;

  @Column({ length: 20 })
  subjectType: string;

  @Column({ type: 'int' })
  causerId: number;

  @Column({ length: 20 })
  causerType: string;

  @Column({ type: 'json' })
  properties: { old?: any; attributes: any };

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
