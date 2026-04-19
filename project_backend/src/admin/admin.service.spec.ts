import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users, Role, UserStatus } from '../users/entities/user.entity';
import { Product, ProductStatus } from '../products/entities/product.entity';
import { Category } from '../products/entities/category.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { Payment, PaymentStatus } from '../orders/entities/payment.entity';
import { Refund, RefundStatus } from '../orders/entities/refund.entity';
import { Coupon, CouponType, CouponStatus } from './entities/coupon.entity';
import { SystemSettings } from './entities/system-settings.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AdminService', () => {
    let service: AdminService;
    let mockUsersRepository: any;
    let mockProductRepository: any;
    let mockCategoryRepository: any;
    let mockOrderRepository: any;
    let mockPaymentRepository: any;
    let mockRefundRepository: any;
    let mockCouponRepository: any;
    let mockSystemSettingsRepository: any;

    beforeEach(async () => {
        mockUsersRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        mockProductRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        mockCategoryRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
        };

        mockOrderRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValue({ total: '1000' }),
            })),
        };

        mockPaymentRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        mockRefundRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
                select: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValue({ total: '100' }),
            })),
        };

        mockCouponRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
        };

        mockSystemSettingsRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AdminService,
                {
                    provide: getRepositoryToken(Users),
                    useValue: mockUsersRepository,
                },
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockProductRepository,
                },
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockCategoryRepository,
                },
                {
                    provide: getRepositoryToken(Order),
                    useValue: mockOrderRepository,
                },
                {
                    provide: getRepositoryToken(Payment),
                    useValue: mockPaymentRepository,
                },
                {
                    provide: getRepositoryToken(Refund),
                    useValue: mockRefundRepository,
                },
                {
                    provide: getRepositoryToken(Coupon),
                    useValue: mockCouponRepository,
                },
                {
                    provide: getRepositoryToken(SystemSettings),
                    useValue: mockSystemSettingsRepository,
                },
            ],
        }).compile();

        service = module.get<AdminService>(AdminService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getPendingSellers', () => {
        it('should return all pending sellers', async () => {
            const pendingSellers = [
                { id: 1, email: 'seller@example.com', role: Role.SELLER, status: UserStatus.PENDING }
            ];
            mockUsersRepository.find.mockResolvedValue(pendingSellers);

            const result = await service.getPendingSellers();

            expect(result).toEqual(pendingSellers);
            expect(mockUsersRepository.find).toHaveBeenCalledWith({
                where: {
                    role: Role.SELLER,
                    status: UserStatus.PENDING
                }
            });
        });
    });

    describe('approveSeller', () => {
        it('should approve a seller', async () => {
            const seller = { id: 1, email: 'seller@example.com', role: Role.SELLER, status: UserStatus.PENDING };
            mockUsersRepository.findOne.mockResolvedValue(seller);
            mockUsersRepository.save.mockResolvedValue({ ...seller, status: UserStatus.APPROVED });

            const result = await service.approveSeller({ sellerId: 1 });

            expect(result.status).toBe(UserStatus.APPROVED);
            expect(mockUsersRepository.save).toHaveBeenCalled();
        });

        it('should throw error if seller not found', async () => {
            mockUsersRepository.findOne.mockResolvedValue(null);

            await expect(service.approveSeller({ sellerId: 999 })).rejects.toThrow(NotFoundException);
        });

        it('should throw error if seller already approved', async () => {
            const seller = { id: 1, email: 'seller@example.com', role: Role.SELLER, status: UserStatus.APPROVED };
            mockUsersRepository.findOne.mockResolvedValue(seller);

            await expect(service.approveSeller({ sellerId: 1 })).rejects.toThrow(BadRequestException);
        });
    });

    describe('banCustomer', () => {
        it('should ban a customer', async () => {
            const customer = { id: 1, email: 'customer@example.com', role: Role.CUSTOMER, status: UserStatus.ACTIVE };
            mockUsersRepository.findOne.mockResolvedValue(customer);
            mockUsersRepository.save.mockResolvedValue({ ...customer, status: UserStatus.BANNED });

            const result = await service.banCustomer({ customerId: 1 });

            expect(result.status).toBe(UserStatus.BANNED);
            expect(mockUsersRepository.save).toHaveBeenCalled();
        });

        it('should throw error if customer not found', async () => {
            mockUsersRepository.findOne.mockResolvedValue(null);

            await expect(service.banCustomer({ customerId: 999 })).rejects.toThrow(NotFoundException);
        });

        it('should throw error if customer already banned', async () => {
            const customer = { id: 1, email: 'customer@example.com', role: Role.CUSTOMER, status: UserStatus.BANNED };
            mockUsersRepository.findOne.mockResolvedValue(customer);

            await expect(service.banCustomer({ customerId: 1 })).rejects.toThrow(BadRequestException);
        });
    });

    describe('createAdmin', () => {
        it('should create a new admin', async () => {
            const createAdminDto = { email: 'admin@example.com', password: 'password123', fullName: 'Admin User' };
            mockUsersRepository.findOne.mockResolvedValue(null);
            mockUsersRepository.create.mockReturnValue(createAdminDto);
            mockUsersRepository.save.mockResolvedValue({ ...createAdminDto, role: Role.ADMIN });

            const result = await service.createAdmin(createAdminDto);

            expect(result.role).toBe(Role.ADMIN);
            expect(mockUsersRepository.save).toHaveBeenCalled();
        });

        it('should throw error if email already exists', async () => {
            const createAdminDto = { email: 'admin@example.com', password: 'password123', fullName: 'Admin User' };
            mockUsersRepository.findOne.mockResolvedValue({ email: 'admin@example.com' });

            await expect(service.createAdmin(createAdminDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('approveProduct', () => {
        it('should approve a product', async () => {
            const product = { id: 1, name: 'Test Product', status: ProductStatus.PENDING };
            mockProductRepository.findOne.mockResolvedValue(product);
            mockProductRepository.save.mockResolvedValue({ ...product, status: ProductStatus.APPROVED });

            const result = await service.approveProduct({ productId: 1 });

            expect(result.status).toBe(ProductStatus.APPROVED);
            expect(mockProductRepository.save).toHaveBeenCalled();
        });

        it('should throw error if product not found', async () => {
            mockProductRepository.findOne.mockResolvedValue(null);

            await expect(service.approveProduct({ productId: 999 })).rejects.toThrow(NotFoundException);
        });

        it('should throw error if product already approved', async () => {
            const product = { id: 1, name: 'Test Product', status: ProductStatus.APPROVED };
            mockProductRepository.findOne.mockResolvedValue(product);

            await expect(service.approveProduct({ productId: 1 })).rejects.toThrow(BadRequestException);
        });
    });

    describe('rejectProduct', () => {
        it('should reject a product', async () => {
            const product = { id: 1, name: 'Test Product', status: ProductStatus.PENDING };
            mockProductRepository.findOne.mockResolvedValue(product);
            mockProductRepository.save.mockResolvedValue({ ...product, status: ProductStatus.REJECTED });

            const result = await service.rejectProduct({ productId: 1, reason: 'Poor quality' });

            expect(result.status).toBe(ProductStatus.REJECTED);
            expect(mockProductRepository.save).toHaveBeenCalled();
        });

        it('should throw error if product not found', async () => {
            mockProductRepository.findOne.mockResolvedValue(null);

            await expect(service.rejectProduct({ productId: 999, reason: 'Test' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('createCategory', () => {
        it('should create a new category', async () => {
            const categoryData = { name: 'Electronics', description: 'Electronic devices' };
            mockCategoryRepository.findOne.mockResolvedValue(null);
            mockCategoryRepository.create.mockReturnValue(categoryData);
            mockCategoryRepository.save.mockResolvedValue({ ...categoryData, id: 1 });

            const result = await service.createCategory('Electronics', 'Electronic devices');

            expect(result.name).toBe('Electronics');
            expect(mockCategoryRepository.save).toHaveBeenCalled();
        });

        it('should throw error if category already exists', async () => {
            mockCategoryRepository.findOne.mockResolvedValue({ name: 'Electronics' });

            await expect(service.createCategory('Electronics')).rejects.toThrow(BadRequestException);
        });
    });

    describe('getPendingProducts', () => {
        it('should return all pending products', async () => {
            const pendingProducts = [
                { id: 1, name: 'Product 1', status: ProductStatus.PENDING }
            ];
            mockProductRepository.find.mockResolvedValue(pendingProducts);

            const result = await service.getPendingProducts();

            expect(result).toEqual(pendingProducts);
            expect(mockProductRepository.find).toHaveBeenCalledWith({
                where: { status: ProductStatus.PENDING },
                relations: ['seller', 'category']
            });
        });
    });
});
