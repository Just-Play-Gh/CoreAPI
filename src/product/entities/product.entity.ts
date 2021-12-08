import { Tax } from 'src/tax/entities/tax.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

enum ProductStatusType {
  Active = 'active',
  Inactive = 'inactive',
}
@Entity({ name: 'products', schema: 'public' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ type: 'double', precision: 6, scale: 3 })
  pricePerLitre: number;

  @Column({
    type: 'enum',
    enum: ProductStatusType,
    default: ProductStatusType.Active,
  })
  status;
  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToMany(() => Tax)
  @JoinTable({ name: 'product_taxes' })
  taxes: Tax[];

  async disable() {
    return (this.status = ProductStatusType.Inactive);
  }
}
