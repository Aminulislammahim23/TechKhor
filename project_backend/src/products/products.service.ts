import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { Users } from '../users/entities/user.entity';
import { Category } from './entities/category.entity';

export class CreateProductDto {
  name: string;
  price?: number;
  description?: string;
  stock?: number;
  categoryId?: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(sellerId: number, createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...productData } = createProductDto;

    let category: Category | undefined;
    if (categoryId) {
      category = await this.categoryRepository.findOne({
        where: { id: categoryId }
      }) || undefined;
      if (!category) {
        throw new BadRequestException(`Category with ID ${categoryId} not found`);
      }
    }

    const product = this.productsRepository.create({
      ...productData,
      seller: { id: sellerId } as Users,
      category,
    });
    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      relations: ['seller', 'category'],
      where: { status: ProductStatus.APPROVED } // Only show approved products to public
    });
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['seller', 'category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findBySeller(sellerId: number): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { seller: { id: sellerId } },
      relations: ['seller', 'category'],
    });
  }

  async update(id: number, sellerId: number, updateProductDto: Partial<CreateProductDto>): Promise<Product> {
    const product = await this.findById(id);
    
    if (product.seller.id !== sellerId) {
      throw new BadRequestException('Only the seller can update this product');
    }

    Object.assign(product, updateProductDto);
    return await this.productsRepository.save(product);
  }

  async delete(id: number, sellerId: number): Promise<void> {
    const product = await this.findById(id);
    
    if (product.seller.id !== sellerId) {
      throw new BadRequestException('Only the seller can delete this product');
    }

    await this.productsRepository.remove(product);
  }
}
