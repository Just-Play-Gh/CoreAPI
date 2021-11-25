import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

enum UserType {
  Admin = 'admin',
  Customer = 'customer',
  Rider = 'rider',
}

@Entity({ name: 'password_resets', schema: 'public' })
export class PasswordReset extends BaseEntity {
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
