import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    /**
     * Get all categories
     * GET /categories
     */
    @Get()
    @Public()
    async getAllCategories() {
        return await this.categoryService.getAllCategories();
    }

    /**
     * Get category by ID
     * GET /categories/:id
     */
    @Get(':id')
    @Public()
    async getCategoryById(@Param('id') id: string) {
        return await this.categoryService.getCategoryById(Number(id));
    }

    /**
     * Get category by name
     * GET /categories/search/:name
     */
    @Get('search/:name')
    @Public()
    async getCategoryByName(@Param('name') name: string) {
        return await this.categoryService.getCategoryByName(name);
    }

    /**
     * Get category statistics
     * GET /categories/stats/all
     */
    @Get('stats/all')
    @Public()
    async getCategoryStatistics() {
        return await this.categoryService.getCategoryStatistics();
    }
}
