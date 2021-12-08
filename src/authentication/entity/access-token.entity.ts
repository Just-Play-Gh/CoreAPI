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

  @Column({ length: 250 })
  token: string;

  @CreateDateColumn()
  created: Date;
}
