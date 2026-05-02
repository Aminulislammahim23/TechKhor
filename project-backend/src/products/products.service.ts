import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const { page = 1, limit = 10, search = '', categoryId, categoryName, approvedOnly, offerOnly } = query;
    const normalizedSearch = String(search || '').trim();
    const take = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (Number(page) - 1) * take;

    const builder = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.category', 'category');

    if (normalizedSearch) {
      const searchWhere =
        '(CAST(product.id AS TEXT) ILIKE :search OR product.name ILIKE :search OR product.description ILIKE :search OR product.tags ILIKE :search OR category.name ILIKE :search)';

      builder.andWhere(searchWhere, { search: `%${normalizedSearch}%` });
    }

    if (categoryId) {
      builder.andWhere('category.id = :categoryId', { categoryId: Number(categoryId) });
    }

    if (categoryName) {
      builder.andWhere('LOWER(category.name) = LOWER(:categoryName)', {
        categoryName: String(categoryName).trim(),
      });
    }

    if (String(approvedOnly) === 'true') {
      builder.andWhere('product.isApproved = true');
    }

    if (String(offerOnly) === 'true') {
      builder
        .andWhere('product.isOffer = true')
        .andWhere('product.offerPrice IS NOT NULL')
        .andWhere('product.offerPrice > 0');
    }

    const [data, total] = await builder
      .orderBy('product.name', 'ASC')
      .take(take)
      .skip(skip)
      .getManyAndCount();

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
        '(CAST(product.id AS TEXT) ILIKE :search OR product.name ILIKE :search OR product.description ILIKE :search OR product.tags ILIKE :search OR category.name ILIKE :search)',
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
      isOffer: Boolean(dto.isOffer) && Number(dto.offerPrice) > 0,
      offerPrice: dto.offerPrice !== undefined ? Number(dto.offerPrice) : null,
      stock: dto.stock,
      image: dto.image || null,
      keyFeatures: this.normalizeKeyFeatures(dto.keyFeatures),
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
          keyFeatures: this.parseUploadKeyFeatures(normalizedRow.keyfeatures),
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
    if (dto.isOffer !== undefined) product.isOffer = dto.isOffer;
    if (dto.offerPrice !== undefined) product.offerPrice = dto.offerPrice === null ? null : Number(dto.offerPrice);
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.image !== undefined) product.image = dto.image || null;
    if (dto.keyFeatures !== undefined) product.keyFeatures = this.normalizeKeyFeatures(dto.keyFeatures);

    if (!product.isOffer) {
      product.offerPrice = null;
    }

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

  private normalizeKeyFeatures(value: unknown) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => String(item || '').trim())
      .filter(Boolean);
  }

  private parseUploadKeyFeatures(value: unknown) {
    return String(value ?? '')
      .split(/[\n;|]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
