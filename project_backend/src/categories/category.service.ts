import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../products/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    /**
     * Create a new category
     */
    async createCategory(createCategoryDto: CreateCategoryDto) {
        const { name } = createCategoryDto;

        // Check if category already exists
        const existingCategory = await this.categoryRepository.findOne({
            where: { name }
        });

        if (existingCategory) {
            throw new BadRequestException('Category already exists');
        }

        const category = this.categoryRepository.create(createCategoryDto);
        return await this.categoryRepository.save(category);
    }

    /**
     * Get all categories
     */
    async getAllCategories() {
        return await this.categoryRepository.find({
            relations: ['products']
        });
    }

    /**
     * Get category by ID
     */
    async getCategoryById(id: number) {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['products']
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    /**
     * Get category by name
     */
    async getCategoryByName(name: string) {
        const category = await this.categoryRepository.findOne({
            where: { name },
            relations: ['products']
        });

        if (!category) {
            throw new NotFoundException(`Category "${name}" not found`);
        }

        return category;
    }

    /**
     * Update a category
     */
    async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoryRepository.findOne({
            where: { id }
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        // Check if new name already exists (only if name is being changed)
        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existingCategory = await this.categoryRepository.findOne({
                where: { name: updateCategoryDto.name }
            });

            if (existingCategory) {
                throw new BadRequestException('Category name already exists');
            }
        }

        Object.assign(category, updateCategoryDto);
        return await this.categoryRepository.save(category);
    }

    /**
     * Delete a category
     */
    async deleteCategory(id: number) {
        const category = await this.categoryRepository.findOne({
            where: { id }
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return await this.categoryRepository.remove(category);
    }

    /**
     * Get category statistics
     */
    async getCategoryStatistics() {
        const categories = await this.categoryRepository.find({
            relations: ['products']
        });

        return categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            productCount: cat.products?.length || 0,
            createdAt: cat.createdAt
        }));
    }
}
