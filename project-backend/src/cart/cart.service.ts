import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) { }

  async add(userId: number, dto: any) {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepo.create({
        user: { id: userId },
        items: [],
      });
      await this.cartRepo.save(cart);
    }

    const product = await this.productRepo.findOneBy({
      id: dto.productId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let item = cart.items.find(
      (i) => i.product.id === dto.productId,
    );

    if (item) {
      item.quantity += dto.quantity;
    } else {
      item = this.itemRepo.create({
        product,
        quantity: dto.quantity,
        cart,
      });
      cart.items.push(item);
    }

    await this.cartRepo.save(cart);
    return cart;
  }

  async getCart(userId: number) {
    return this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
  }
}