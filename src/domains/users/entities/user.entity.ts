import { Entity, Column } from 'typeorm';
import { TABLES, UserRole } from '../../../common/constant';
import { BaseEntity } from '../../../common/base.entity';

@Entity(TABLES.user)
export class Users extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;
}
