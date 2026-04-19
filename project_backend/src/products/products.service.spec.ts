import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService, CreateProductDto } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        price: 100,
        description: 'A test product',
        stock: 10,
        category: 'Electronics',
      };

      const product = {
        id: 1,
        ...createProductDto,
        seller: { id: 1 },
      };

      mockProductRepository.create.mockReturnValue(product);
      mockProductRepository.save.mockResolvedValue(product);

      const result = await service.create(1, createProductDto);

      expect(mockProductRepository.create).toHaveBeenCalledWith({
        ...createProductDto,
        seller: { id: 1 },
      });
      expect(mockProductRepository.save).toHaveBeenCalledWith(product);
      expect(result).toEqual(product);
    });
  });

  describe('findById', () => {
    it('should find a product by id', async () => {
      const product = {
        id: 1,
        name: 'Test Product',
        seller: { id: 1 },
      };

      mockProductRepository.findOne.mockResolvedValue(product);

      const result = await service.findById(1);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['seller'],
      });
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow('Product with ID 999 not found');
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];

      mockProductRepository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(mockProductRepository.find).toHaveBeenCalledWith({ relations: ['seller'] });
      expect(result).toEqual(products);
    });
  });
});
