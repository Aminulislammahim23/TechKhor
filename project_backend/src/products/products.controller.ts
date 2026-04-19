import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService, CreateProductDto } from './products.service';
import { JwtGuard } from '../auth/jwt/jwtGuard.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/roles/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return await this.productsService.create(req.user.userId, createProductDto);
  }

  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.productsService.findById(id);
  }

  @Get('seller/:sellerId')
  async findBySeller(@Param('sellerId') sellerId: number) {
    return await this.productsService.findBySeller(sellerId);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: Partial<CreateProductDto>,
    @Request() req,
  ) {
    return await this.productsService.update(id, req.user.userId, updateProductDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  async partialUpdate(
    @Param('id') id: number,
    @Body() updateProductDto: Partial<CreateProductDto>,
    @Request() req,
  ) {
    return await this.productsService.update(id, req.user.userId, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  async delete(@Param('id') id: number, @Request() req) {
    await this.productsService.delete(id, req.user.userId);
    return { message: 'Product deleted successfully' };
  }
}
