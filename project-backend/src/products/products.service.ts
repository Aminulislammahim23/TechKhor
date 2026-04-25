import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as XLSX from 'xlsx';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

type UploadProductRow = Record<string, unknown>;

type InvalidUploadRow = {
  rowNumber: number;
  row: UploadProductRow;
  errors: string[];
};

const MAX_BULK_PRODUCT_ROWS = 1000;
const REQUIRED_UPLOAD_FIELDS = ['name', 'description', 'price', 'stock'];

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

  async findForSellerPos(sellerId: number, query: any) {
    const search = String(query?.search || '').trim();
    const limit = Math.min(Math.max(Number(query?.limit || 20), 1), 50);
    const searchPattern = `%${search}%`;

    const builder = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.category', 'category')
      .where('seller.id = :sellerId', { sellerId })
      .andWhere('product.stock > 0');

    if (search) {
      builder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.tags ILIKE :search)',
        { search: searchPattern },
      );
    }

    return builder
      .orderBy('product.name', 'ASC')
      .take(limit)
      .getMany();
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

  async uploadProducts(file: any, user: any) {
    const rows = this.parseSpreadsheet(file);

    if (rows.length === 0) {
      throw new BadRequestException('Uploaded file does not contain product rows');
    }

    if (rows.length > MAX_BULK_PRODUCT_ROWS) {
      throw new BadRequestException(
        `A maximum of ${MAX_BULK_PRODUCT_ROWS} product rows can be uploaded at once`,
      );
    }

    const invalidRows: InvalidUploadRow[] = [];
    const productsToSave: Product[] = [];
    const categoryById = new Map<number, Category | null>();
    const categoryByName = new Map<string, Category | null>();

    for (const { row, rowNumber } of rows) {
      const normalizedRow = this.normalizeUploadRow(row);
      const errors = this.validateUploadRow(normalizedRow);

      let category: Category | undefined;
      if (errors.length === 0) {
        try {
          category = await this.resolveUploadCategory(
            normalizedRow,
            categoryById,
            categoryByName,
          );
        } catch (error) {
          errors.push(error.message || 'Invalid category');
        }
      }

      if (errors.length > 0) {
        invalidRows.push({
          rowNumber,
          row: normalizedRow,
          errors,
        });
        continue;
      }

      productsToSave.push(
        this.repo.create({
          name: String(normalizedRow.name).trim(),
          description: String(normalizedRow.description).trim(),
          price: Number(normalizedRow.price),
          stock: Number(normalizedRow.stock),
          image: this.optionalString(normalizedRow.image) || null,
          tags: this.optionalString(normalizedRow.tags),
          seller: { id: user.id },
          category,
          isApproved: false,
        }),
      );
    }

    if (productsToSave.length === 0) {
      throw new BadRequestException({
        message: 'No valid product rows found',
        invalidRows,
      });
    }

    const savedProducts = await this.repo.save(productsToSave);

    return {
      message: 'Bulk product upload completed',
      totalRows: rows.length,
      createdCount: savedProducts.length,
      invalidCount: invalidRows.length,
      invalidRows,
      products: savedProducts,
    };
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

  private parseSpreadsheet(file: any) {
    try {
      const workbook = XLSX.read(file.buffer, {
        type: 'buffer',
        raw: false,
      });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        return [];
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<UploadProductRow>(worksheet, {
        defval: '',
        raw: false,
      });

      return rows
        .map((row, index) => ({
          row,
          rowNumber: index + 2,
        }))
        .filter(({ row }) =>
          Object.values(row).some((value) => this.optionalString(value)),
        );
    } catch {
      throw new BadRequestException('Unable to parse the uploaded file');
    }
  }

  private normalizeUploadRow(row: UploadProductRow) {
    const normalized: UploadProductRow = {};

    for (const [key, value] of Object.entries(row)) {
      normalized[this.normalizeHeader(key)] = value;
    }

    return normalized;
  }

  private normalizeHeader(header: string) {
    return String(header || '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '');
  }

  private validateUploadRow(row: UploadProductRow) {
    const errors: string[] = [];

    for (const field of REQUIRED_UPLOAD_FIELDS) {
      if (!this.optionalString(row[field])) {
        errors.push(`${field} is required`);
      }
    }

    const price = Number(row.price);
    if (!Number.isFinite(price) || price <= 0) {
      errors.push('price must be a positive number');
    }

    const stock = Number(row.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      errors.push('stock must be a zero or positive whole number');
    }

    return errors;
  }

  private async resolveUploadCategory(
    row: UploadProductRow,
    categoryById: Map<number, Category | null>,
    categoryByName: Map<string, Category | null>,
  ) {
    const rawCategoryId = this.optionalString(row.categoryid);
    const rawCategoryName = this.optionalString(row.categoryname);

    if (rawCategoryId) {
      const categoryId = Number(rawCategoryId);

      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        throw new BadRequestException('categoryId must be a valid number');
      }

      if (!categoryById.has(categoryId)) {
        const category = await this.categoryRepo.findOne({
          where: { id: categoryId },
        });
        categoryById.set(categoryId, category || null);
      }

      const category = categoryById.get(categoryId);
      if (!category) {
        throw new NotFoundException(`Category not found: ${categoryId}`);
      }

      return category;
    }

    if (rawCategoryName) {
      const key = rawCategoryName.toLowerCase();

      if (!categoryByName.has(key)) {
        const category = await this.categoryRepo.findOne({
          where: { name: rawCategoryName },
        });
        categoryByName.set(key, category || null);
      }

      const category = categoryByName.get(key);
      if (!category) {
        throw new NotFoundException(`Category not found: ${rawCategoryName}`);
      }

      return category;
    }

    return undefined;
  }

  private optionalString(value: unknown) {
    return String(value ?? '').trim();
  }
}
