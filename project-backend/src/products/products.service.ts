import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, Like } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
  ) { }

  // 🔥 SEARCH + PAGINATION
  async findAll(query: any) {
    const { page = 1, limit = 10, search = '' } = query;

    const [data, total] = await this.repo.findAndCount({
      where: [
        { name: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
      ],
      relations: ['seller', 'category'],
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    return {
      total,
      page: Number(page),
      data,
    };
  }

  // ✅ Single Product
  async findOne(id: number) {
    const product = await this.repo.findOne({
      where: { id },
      relations: ['seller', 'category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // ✅ Create
  create(dto: any, user: any) {
    const product = this.repo.create({
      ...dto,
      seller: user,
    });

    return this.repo.save(product);
  }

  // ✅ Update
  async update(id: number, dto: any) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  // ✅ Delete
  async remove(id: number) {
    const product = await this.findOne(id);
    return this.repo.remove(product);
  }

  // 🔥 Admin approve
  async approve(id: number) {
    const product = await this.findOne(id);
    product.isApproved = true;
    return this.repo.save(product);
  }
}