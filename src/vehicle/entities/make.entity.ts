import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

// enum UserStatusType {
//   Active = 'active',
//   Inactive = 'inactive',
// }
@Entity({ name: 'AllMakes', schema: 'public' })
export class AllMakes extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  make_id: number;

  @Column({ length: 50 })
  make_name: string;
}
