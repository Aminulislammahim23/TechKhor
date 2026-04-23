import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;
}