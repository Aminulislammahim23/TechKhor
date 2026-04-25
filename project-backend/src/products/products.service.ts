import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

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

  async create(dto: CreateProductDto, user: any) {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.repo.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      image: dto.image || null,
      seller: user,
      category,
      isApproved: false,
    });

    return this.repo.save(product);
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (dto.categoryId !== undefined) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      product.category = category;
    }

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.image !== undefined) product.image = dto.image || null;

    return this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.repo.remove(product);
  }

  async approve(id: number) {
    const product = await this.findOne(id);
    product.isApproved = true;
    return this.repo.save(product);
  }
}
