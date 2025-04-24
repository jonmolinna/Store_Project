import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Sede {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  phone: string;

  @Column({ default: true, type: 'boolean' })
  flag: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => User, (user) => user.sede, { cascade: true })
  users: User[];
}
