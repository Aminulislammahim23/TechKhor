import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  const mockCartRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCartItemRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: mockCartItemRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrCreateCart', () => {
    it('should return existing cart', async () => {
      const cart = { id: 1, user: { id: 1 }, cartItems: [] };

      mockCartRepository.findOne.mockResolvedValue(cart);

      const result = await service.getOrCreateCart(1);

      expect(mockCartRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ['cartItems', 'cartItems.product'],
      });
      expect(result).toEqual(cart);
    });

    it('should create new cart if not exists', async () => {
      const newCart = { id: 1, user: { id: 1 }, cartItems: [] };

      mockCartRepository.findOne.mockResolvedValue(null);
      mockCartRepository.create.mockReturnValue(newCart);
      mockCartRepository.save.mockResolvedValue(newCart);

      const result = await service.getOrCreateCart(1);

      expect(mockCartRepository.create).toHaveBeenCalledWith({
        user: { id: 1 },
      });
      expect(mockCartRepository.save).toHaveBeenCalledWith(newCart);
      expect(result).toEqual(newCart);
    });
  });

  describe('addToCart', () => {
    it('should add product to cart', async () => {
      const cart = { id: 1, user: { id: 1 }, cartItems: [] };
      const product = { id: 1, name: 'Test', price: 100, stock: 10 };
      const cartItem = { id: 1, quantity: 1, product, cart, unitPrice: 100 };

      mockCartRepository.findOne.mockResolvedValue(cart);
      mockProductRepository.findOne.mockResolvedValue(product);
      mockCartItemRepository.findOne.mockResolvedValue(null);
      mockCartItemRepository.create.mockReturnValue(cartItem);
      mockCartItemRepository.save.mockResolvedValue(cartItem);

      const result = await service.addToCart(1, 1, 1);

      expect(result).toEqual(cartItem);
    });

    it('should throw error if insufficient stock', async () => {
      const cart = { id: 1, user: { id: 1 }, cartItems: [] };
      const product = { id: 1, name: 'Test', price: 100, stock: 1 };

      mockCartRepository.findOne.mockResolvedValue(cart);
      mockProductRepository.findOne.mockResolvedValue(product);

      await expect(service.addToCart(1, 1, 10)).rejects.toThrow('Insufficient stock');
    });

    it('should throw NotFoundException if product not found', async () => {
      const cart = { id: 1, user: { id: 1 }, cartItems: [] };

      mockCartRepository.findOne.mockResolvedValue(cart);
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.addToCart(1, 999, 1)).rejects.toThrow(
        'Product with ID 999 not found',
      );
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const cart = { id: 1, user: { id: 1 }, cartItems: [] };
      const cartItem = { id: 1, quantity: 1, cart };

      mockCartRepository.findOne.mockResolvedValue(cart);
      mockCartItemRepository.findOne.mockResolvedValue(cartItem);

      await service.removeFromCart(1, 1);

      expect(mockCartItemRepository.remove).toHaveBeenCalledWith(cartItem);
    });

    it('should throw error if cart item not found', async () => {
      const cart = { id: 1, user: { id: 1 }, cartItems: [] };

      mockCartRepository.findOne.mockResolvedValue(cart);
      mockCartItemRepository.findOne.mockResolvedValue(null);

      await expect(service.removeFromCart(1, 999)).rejects.toThrow('Cart item not found');
    });
  });
});
