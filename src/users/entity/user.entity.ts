import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar', length: 100, nullable: false})
    name: string

    @Column({name: 'last_name', type: 'varchar', length: 100, nullable: false})
    lastName: string

    @Column({ type: 'date', name: 'birth_date', nullable: true })
    birthDate: Date

    @Column({type: 'varchar', length: 100, nullable: false, unique: true})
    username: string

    @Column({ type: 'varchar', length: 100, nullable: false })
    password: string

    @Column({ type: 'simple-array'})
    roles: string[]

    @Column({ default: true, type: 'boolean' })
    flag: boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date
}