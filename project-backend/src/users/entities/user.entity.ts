import{
    Entity,
     PrimaryGeneratedColumn,
      Column,
       CreateDateColumn
} from 'typeorm';

export enum Role{
    ADMIN = 'admin',
    SELLER = 'seller',
    CUSTOMER = 'customer',
}

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.CUSTOMER,
    })
    role: Role;

    @CreateDateColumn()
    createdAt: Date;
}