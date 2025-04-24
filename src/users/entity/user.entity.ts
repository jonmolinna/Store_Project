import { Exclude } from 'class-transformer';
import { Sede } from 'src/sedes/entity/sede.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../role/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: false })
  lastName: string;

  @Column({ type: 'date', name: 'birth_date', nullable: true })
  birthDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  username: string;
  
  @Exclude()
  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'simple-array' })
  roles: Role[];

  @Column({ default: true, type: 'boolean' })
  flag: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Sede, (sede) => sede.users)
  @JoinColumn({name: "sede_id"})
  sede: Sede

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
