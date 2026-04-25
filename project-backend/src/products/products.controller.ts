import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, Req, Query, UploadedFile,
  UseInterceptors, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) { }

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @Get('seller/pos-search')
  findForSellerPos(@Query() query: any, @Req() req) {
    return this.service.findForSellerPos(req.user.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @Post()
  create(@Body() dto: CreateProductDto, @Req() req) {
    return this.service.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @Post('upload-products')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const allowedExtensions = ['.xlsx', '.csv'];
        const extension = extname(file.originalname || '').toLowerCase();

        if (!allowedExtensions.includes(extension)) {
          return callback(
            new BadRequestException('Only .xlsx and .csv files are allowed'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  uploadProducts(@UploadedFile() file: any, @Req() req) {
    if (!file) {
      throw new BadRequestException('Upload file is required');
    }

    return this.service.uploadProducts(file, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/approve')
  approve(@Param('id') id: number) {
    return this.service.approve(id);
  }
}
