import {
  BadRequestException,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Not, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(dto) {
    const name = String(dto?.name || '').trim();

    if (!name) {
      throw new BadRequestException('Category name is required');
    }

    const exists = await this.repo.findOne({
      where: { name },
    });

    if (exists) throw new ConflictException('Category exists');

    const category = this.repo.create({
      name,
      keyFeatures: this.normalizeKeyFeatures(dto?.keyFeatures),
    });
    return this.repo.save(category);
  }

  findAll() {
    return this.repo.find();
  }

  async update(id: number, dto) {
    const name = String(dto?.name || '').trim();

    if (!name) {
      throw new BadRequestException('Category name is required');
    }

    const category = await this.repo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const exists = await this.repo.findOne({
      where: {
        name,
        id: Not(id),
      },
    });

    if (exists) {
      throw new ConflictException('Category exists');
    }

    category.name = name;
    if (dto?.keyFeatures !== undefined) {
      category.keyFeatures = this.normalizeKeyFeatures(dto.keyFeatures);
    }

    return this.repo.save(category);
  }

  async remove(id: number) {
    const category = await this.repo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const productCount = await this.productRepo.count({
      where: { category: { id } },
    });

    if (productCount > 0) {
      throw new ConflictException(
        `Cannot delete category. ${productCount} product(s) are using it.`,
      );
    }

    await this.repo.remove(category);

    return {
      message: 'Category deleted successfully',
      id,
    };
  }

  private normalizeKeyFeatures(value: unknown) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => String(item || '').trim())
      .filter(Boolean);
  }
}
