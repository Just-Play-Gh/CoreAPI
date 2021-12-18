import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'access_tokens', schema: 'public' })
export class AccessToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: string;

  @Column({ type: 'text' })
  token: string;

  @CreateDateColumn()
  created: Date;
}
