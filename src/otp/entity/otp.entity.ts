import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserType {
  Customer = 'customer',
  Driver = 'driver',
}

@Entity({ name: 'otps', schema: 'public' })
export class Otp extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column({ length: 15 })
  phoneNumber: string;

  @Column({ length: 100 })
  token: string;

  @CreateDateColumn()
  created: Date;

  @BeforeInsert()
  async hashToken(): Promise<void> {
    if (this.token) {
      this.token = await bcrypt.hash(this.token, 8);
    }
  }

  async validateToken(otp: string): Promise<boolean> {
    return await bcrypt.compare(otp, this.token);
  }
}
