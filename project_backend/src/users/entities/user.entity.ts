import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { Product } from "../../products/entities/product.entity";
import { Order } from "../../orders/entities/order.entity";
import { Cart } from "../../cart/entities/cart.entity";
import { WithdrawRequest } from "../../seller/entities/withdraw-request.entity";
import { Address } from "../../customer/entities/address.entity";
import { Review } from "../../customer/entities/review.entity";

export enum Role {
    ADMIN = "admin",
    SELLER = "seller",
    CUSTOMER = "customer"
}

export enum UserStatus {
    PENDING = "pending",           // For sellers awaiting approval
    APPROVED = "approved",         // For approved sellers
    REJECTED = "rejected",         // For rejected sellers
    ACTIVE = "active",             // For active customers and admins
    BANNED = "banned"              // For banned customers
}

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    fullName: string;
    
    @Column({
            type: "varchar",
            length: 255,
            unique: true,
            nullable: false
        }
    )
    email: string;

    @Column(
        {
            type: 'varchar',
            length: 255,
            nullable: false
        }
    )
    password: string;

    @Column(
        { type: "enum", enum: Role, default: Role.CUSTOMER }
    )
    role: Role;

    @Column(
        { type: "enum", enum: UserStatus, default: UserStatus.ACTIVE }
    )
    status: UserStatus;

    @OneToMany(() => Product, product => product.seller)
    products: Product[];

    @OneToMany(() => Order, order => order.customer)
    orders: Order[];

    @OneToOne(() => Cart, cart => cart.user, { nullable: true })
    cart: Cart;

    @OneToMany(() => WithdrawRequest, withdrawRequest => withdrawRequest.seller)
    withdrawRequests: WithdrawRequest[];

    @OneToMany(() => Address, address => address.customer)
    addresses: Address[];

    @OneToMany(() => Review, review => review.customer)
    reviews: Review[];
}