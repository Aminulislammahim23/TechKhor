import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Between } from 'typeorm';
import { Users, Role, UserStatus } from '../users/entities/user.entity';
import { Product, ProductStatus } from '../products/entities/product.entity';
import { Category } from '../products/entities/category.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { Payment, PaymentStatus } from '../orders/entities/payment.entity';
import { Refund, RefundStatus } from '../orders/entities/refund.entity';
import { Coupon, CouponType, CouponStatus } from './entities/coupon.entity';
import { SystemSettings } from './entities/system-settings.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApproveSellerDto } from './dto/approve-seller.dto';
import { BanCustomerDto } from './dto/ban-customer.dto';
import { ApproveProductDto } from './dto/approve-product.dto';
import { RejectProductDto } from './dto/reject-product.dto';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { UpdateSystemSettingsDto } from './dto/system-settings.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Refund)
        private refundRepository: Repository<Refund>,
        @InjectRepository(Coupon)
        private couponRepository: Repository<Coupon>,
        @InjectRepository(SystemSettings)
        private systemSettingsRepository: Repository<SystemSettings>,
    ) {}

    // ============ SELLER MANAGEMENT ============

    /**
     * Get all sellers with pending approval status
     */
    async getPendingSellers() {
        return await this.usersRepository.find({
            where: {
                role: Role.SELLER,
                status: UserStatus.PENDING
            }
        });
    }

    /**
     * Get all approved sellers
     */
    async getApprovedSellers() {
        return await this.usersRepository.find({
            where: {
                role: Role.SELLER,
                status: UserStatus.APPROVED
            },
            relations: ['products']
        });
    }

    /**
     * Get all sellers (approved + pending + rejected)
     */
    async getAllSellers() {
        return await this.usersRepository.find({
            where: { role: Role.SELLER },
            relations: ['products']
        });
    }

    /**
     * Approve a seller's registration
     */
    async approveSeller(approveSellersDto: ApproveSellerDto) {
        const { sellerId } = approveSellersDto;
        
        const seller = await this.usersRepository.findOne({
            where: { id: sellerId, role: Role.SELLER }
        });

        if (!seller) {
            throw new NotFoundException(`Seller with ID ${sellerId} not found`);
        }

        if (seller.status === UserStatus.APPROVED) {
            throw new BadRequestException('Seller is already approved');
        }

        seller.status = UserStatus.APPROVED;
        return await this.usersRepository.save(seller);
    }

    /**
     * Reject a seller's registration
     */
    async rejectSeller(sellerId: number) {
        const seller = await this.usersRepository.findOne({
            where: { id: sellerId, role: Role.SELLER }
        });

        if (!seller) {
            throw new NotFoundException(`Seller with ID ${sellerId} not found`);
        }

        if (seller.status === UserStatus.REJECTED) {
            throw new BadRequestException('Seller is already rejected');
        }

        seller.status = UserStatus.REJECTED;
        return await this.usersRepository.save(seller);
    }

    // ============ CUSTOMER MANAGEMENT ============

    /**
     * Get all customers
     */
    async getAllCustomers() {
        return await this.usersRepository.find({
            where: { role: Role.CUSTOMER },
            relations: ['orders', 'cart']
        });
    }

    /**
     * Get active customers
     */
    async getActiveCustomers() {
        return await this.usersRepository.find({
            where: { role: Role.CUSTOMER, status: UserStatus.ACTIVE },
            relations: ['orders', 'cart']
        });
    }

    /**
     * Get banned customers
     */
    async getBannedCustomers() {
        return await this.usersRepository.find({
            where: { role: Role.CUSTOMER, status: UserStatus.BANNED }
        });
    }

    /**
     * Ban a customer
     */
    async banCustomer(banCustomerDto: BanCustomerDto) {
        const { customerId } = banCustomerDto;
        
        const customer = await this.usersRepository.findOne({
            where: { id: customerId, role: Role.CUSTOMER }
        });

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${customerId} not found`);
        }

        if (customer.status === UserStatus.BANNED) {
            throw new BadRequestException('Customer is already banned');
        }

        customer.status = UserStatus.BANNED;
        return await this.usersRepository.save(customer);
    }

    /**
     * Unblock (unban) a customer
     */
    async unblockCustomer(customerId: number) {
        const customer = await this.usersRepository.findOne({
            where: { id: customerId, role: Role.CUSTOMER }
        });

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${customerId} not found`);
        }

        if (customer.status === UserStatus.ACTIVE) {
            throw new BadRequestException('Customer is already active');
        }

        customer.status = UserStatus.ACTIVE;
        return await this.usersRepository.save(customer);
    }

    // ============ ADMIN MANAGEMENT ============

    /**
     * Create a new admin account
     */
    async createAdmin(createAdminDto: CreateAdminDto) {
        const { email, password, fullName } = createAdminDto;

        // Check if email already exists
        const existingUser = await this.usersRepository.findOne({
            where: { email }
        });

        if (existingUser) {
            throw new BadRequestException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        const admin = this.usersRepository.create({
            email,
            password: hashedPassword,
            fullName,
            role: Role.ADMIN,
            status: UserStatus.ACTIVE
        });

        return await this.usersRepository.save(admin);
    }

    /**
     * Get all admins
     */
    async getAllAdmins() {
        return await this.usersRepository.find({
            where: { role: Role.ADMIN }
        });
    }

    /**
     * Get all users (for system overview)
     */
    async getAllUsers() {
        return await this.usersRepository.find({
            relations: ['products', 'orders', 'cart']
        });
    }

    /**
     * Get user statistics
     */
    async getUserStatistics() {
        const totalUsers = await this.usersRepository.count();
        const totalAdmins = await this.usersRepository.count({
            where: { role: Role.ADMIN }
        });
        const totalSellers = await this.usersRepository.count({
            where: { role: Role.SELLER }
        });
        const approvedSellers = await this.usersRepository.count({
            where: { role: Role.SELLER, status: UserStatus.APPROVED }
        });
        const pendingSellers = await this.usersRepository.count({
            where: { role: Role.SELLER, status: UserStatus.PENDING }
        });
        const totalCustomers = await this.usersRepository.count({
            where: { role: Role.CUSTOMER }
        });
        const activeCustomers = await this.usersRepository.count({
            where: { role: Role.CUSTOMER, status: UserStatus.ACTIVE }
        });
        const bannedCustomers = await this.usersRepository.count({
            where: { role: Role.CUSTOMER, status: UserStatus.BANNED }
        });

        return {
            totalUsers,
            admins: totalAdmins,
            sellers: {
                total: totalSellers,
                approved: approvedSellers,
                pending: pendingSellers,
                rejected: totalSellers - approvedSellers - pendingSellers
            },
            customers: {
                total: totalCustomers,
                active: activeCustomers,
                banned: bannedCustomers
            }
        };
    }

    // ============ PRODUCT MANAGEMENT ============

    /**
     * Get all products pending review
     */
    async getPendingProducts() {
        return await this.productRepository.find({
            where: { status: ProductStatus.PENDING },
            relations: ['seller', 'category']
        });
    }

    /**
     * Get all approved products
     */
    async getApprovedProducts() {
        return await this.productRepository.find({
            where: { status: ProductStatus.APPROVED },
            relations: ['seller', 'category']
        });
    }

    /**
     * Get all rejected products
     */
    async getRejectedProducts() {
        return await this.productRepository.find({
            where: { status: ProductStatus.REJECTED },
            relations: ['seller', 'category']
        });
    }

    /**
     * Get all removed (fake/low quality) products
     */
    async getRemovedProducts() {
        return await this.productRepository.find({
            where: { status: ProductStatus.REMOVED },
            relations: ['seller', 'category']
        });
    }

    /**
     * Get all products for review (pending + rejected)
     */
    async getProductsForReview() {
        return await this.productRepository.find({
            where: [
                { status: ProductStatus.PENDING },
                { status: ProductStatus.REJECTED }
            ],
            relations: ['seller', 'category'],
            order: { createdAt: 'ASC' }
        });
    }

    /**
     * Approve a product
     */
    async approveProduct(approveProductDto: ApproveProductDto) {
        const { productId } = approveProductDto;

        const product = await this.productRepository.findOne({
            where: { id: productId }
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        if (product.status === ProductStatus.APPROVED) {
            throw new BadRequestException('Product is already approved');
        }

        product.status = ProductStatus.APPROVED;
        return await this.productRepository.save(product);
    }

    /**
     * Reject a product
     */
    async rejectProduct(rejectProductDto: RejectProductDto) {
        const { productId, reason } = rejectProductDto;

        const product = await this.productRepository.findOne({
            where: { id: productId }
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        if (product.status === ProductStatus.REJECTED) {
            throw new BadRequestException('Product is already rejected');
        }

        product.status = ProductStatus.REJECTED;
        // You can add a rejection reason field to Product entity if needed
        return await this.productRepository.save(product);
    }

    /**
     * Remove a product (fake/low quality)
     */
    async removeProduct(productId: number, reason: string = 'Fake or low quality product') {
        const product = await this.productRepository.findOne({
            where: { id: productId }
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        if (product.status === ProductStatus.REMOVED) {
            throw new BadRequestException('Product is already removed');
        }

        product.status = ProductStatus.REMOVED;
        return await this.productRepository.save(product);
    }

    /**
     * Get products by seller for review
     */
    async getSellerProductsForReview(sellerId: number) {
        return await this.productRepository.find({
            where: { seller: { id: sellerId } },
            relations: ['seller', 'category'],
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Get product statistics
     */
    async getProductStatistics() {
        const totalProducts = await this.productRepository.count();
        const pendingProducts = await this.productRepository.count({
            where: { status: ProductStatus.PENDING }
        });
        const approvedProducts = await this.productRepository.count({
            where: { status: ProductStatus.APPROVED }
        });
        const rejectedProducts = await this.productRepository.count({
            where: { status: ProductStatus.REJECTED }
        });
        const removedProducts = await this.productRepository.count({
            where: { status: ProductStatus.REMOVED }
        });

        return {
            total: totalProducts,
            pending: pendingProducts,
            approved: approvedProducts,
            rejected: rejectedProducts,
            removed: removedProducts
        };
    }

    // ============ CATEGORY MANAGEMENT ============

    /**
     * Create a new category (Admin only)
     */
    async createCategory(name: string, description?: string, image?: string) {
        const existingCategory = await this.categoryRepository.findOne({
            where: { name }
        });

        if (existingCategory) {
            throw new BadRequestException('Category already exists');
        }

        const category = this.categoryRepository.create({
            name,
            description,
            image
        });

        return await this.categoryRepository.save(category);
    }

    /**
     * Update a category
     */
    async updateCategory(id: number, name?: string, description?: string, image?: string) {
        const category = await this.categoryRepository.findOne({
            where: { id }
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        if (name && name !== category.name) {
            const existingCategory = await this.categoryRepository.findOne({
                where: { name }
            });

            if (existingCategory) {
                throw new BadRequestException('Category name already exists');
            }
        }

        if (name) category.name = name;
        if (description) category.description = description;
        if (image) category.image = image;

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
     * Get all categories
     */
    async getAllCategories() {
        return await this.categoryRepository.find({
            relations: ['products']
        });
    }

    // ============ ORDER MONITORING ============

    /**
     * Get all orders for monitoring
     */
    async getAllOrders() {
        return await this.orderRepository.find({
            relations: ['customer', 'orderItems', 'orderItems.product', 'payments'],
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Get orders by status
     */
    async getOrdersByStatus(status: OrderStatus) {
        return await this.orderRepository.find({
            where: { status },
            relations: ['customer', 'orderItems', 'orderItems.product', 'payments'],
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Get recent orders (last 30 days)
     */
    async getRecentOrders(days: number = 30) {
        const date = new Date();
        date.setDate(date.getDate() - days);

        return await this.orderRepository.find({
            where: { createdAt: MoreThanOrEqual(date) },
            relations: ['customer', 'orderItems', 'orderItems.product'],
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Get order details by ID
     */
    async getOrderDetails(orderId: number) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['customer', 'orderItems', 'orderItems.product', 'payments', 'payments.processedBy']
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }

        return order;
    }

    // ============ PAYMENT MONITORING ============

    /**
     * Get all payments for monitoring
     */
    async getAllPayments() {
        return await this.paymentRepository.find({
            relations: ['order', 'order.customer', 'processedBy'],
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Get payments by status
     */
    async getPaymentsByStatus(status: PaymentStatus) {
        return await this.paymentRepository.find({
            where: { status },
            relations: ['order', 'order.customer', 'processedBy'],
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Get pending payments for verification
     */
    async getPendingPayments() {
        return await this.paymentRepository.find({
            where: { status: PaymentStatus.PENDING },
            relations: ['order', 'order.customer'],
            order: { createdAt: 'ASC' }
        });
    }

    /**
     * Verify payment (mark as completed)
     */
    async verifyPayment(paymentId: number, adminId: number) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
            relations: ['order']
        });

        if (!payment) {
            throw new NotFoundException(`Payment with ID ${paymentId} not found`);
        }

        if (payment.status !== PaymentStatus.PENDING) {
            throw new BadRequestException('Payment is not in pending status');
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId }
        });

        if (!admin) {
            throw new NotFoundException(`Admin with ID ${adminId} not found`);
        }

        payment.status = PaymentStatus.COMPLETED;
        payment.processedBy = admin;

        // Update order status to paid
        if (payment.order) {
            payment.order.status = OrderStatus.PAID;
            await this.orderRepository.save(payment.order);
        }

        return await this.paymentRepository.save(payment);
    }

    // ============ REFUND MONITORING ============

    /**
     * Get all refunds for monitoring
     */
    async getAllRefunds() {
        return await this.refundRepository.find({
            relations: ['order', 'order.customer', 'requestedBy', 'processedBy', 'originalPayment'],
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Get pending refunds for approval
     */
    async getPendingRefunds() {
        return await this.refundRepository.find({
            where: { status: RefundStatus.REQUESTED },
            relations: ['order', 'order.customer', 'requestedBy'],
            order: { createdAt: 'ASC' }
        });
    }

    /**
     * Approve refund request
     */
    async approveRefund(refundId: number, adminId: number, adminNotes?: string) {
        const refund = await this.refundRepository.findOne({
            where: { id: refundId },
            relations: ['order']
        });

        if (!refund) {
            throw new NotFoundException(`Refund with ID ${refundId} not found`);
        }

        if (refund.status !== RefundStatus.REQUESTED) {
            throw new BadRequestException('Refund is not in requested status');
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId }
        });

        if (!admin) {
            throw new NotFoundException(`Admin with ID ${adminId} not found`);
        }

        refund.status = RefundStatus.APPROVED;
        refund.processedBy = admin;
        refund.adminNotes = adminNotes;

        // Update order status
        if (refund.order) {
            refund.order.status = OrderStatus.REFUNDED;
            await this.orderRepository.save(refund.order);
        }

        return await this.refundRepository.save(refund);
    }

    /**
     * Reject refund request
     */
    async rejectRefund(refundId: number, adminId: number, adminNotes?: string) {
        const refund = await this.refundRepository.findOne({
            where: { id: refundId }
        });

        if (!refund) {
            throw new NotFoundException(`Refund with ID ${refundId} not found`);
        }

        if (refund.status !== RefundStatus.REQUESTED) {
            throw new BadRequestException('Refund is not in requested status');
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId }
        });

        if (!admin) {
            throw new NotFoundException(`Admin with ID ${adminId} not found`);
        }

        refund.status = RefundStatus.REJECTED;
        refund.processedBy = admin;
        refund.adminNotes = adminNotes;

        return await this.refundRepository.save(refund);
    }

    // ============ COMPREHENSIVE STATISTICS ============

    /**
     * Get comprehensive order and transaction statistics
     */
    async getOrderTransactionStatistics() {
        // Order statistics
        const totalOrders = await this.orderRepository.count();
        const pendingOrders = await this.orderRepository.count({
            where: { status: OrderStatus.PENDING }
        });
        const paidOrders = await this.orderRepository.count({
            where: { status: OrderStatus.PAID }
        });
        const processingOrders = await this.orderRepository.count({
            where: { status: OrderStatus.PROCESSING }
        });
        const shippedOrders = await this.orderRepository.count({
            where: { status: OrderStatus.SHIPPED }
        });
        const deliveredOrders = await this.orderRepository.count({
            where: { status: OrderStatus.DELIVERED }
        });
        const cancelledOrders = await this.orderRepository.count({
            where: { status: OrderStatus.CANCELLED }
        });
        const refundedOrders = await this.orderRepository.count({
            where: { status: OrderStatus.REFUNDED }
        });

        // Payment statistics
        const totalPayments = await this.paymentRepository.count();
        const pendingPayments = await this.paymentRepository.count({
            where: { status: PaymentStatus.PENDING }
        });
        const completedPayments = await this.paymentRepository.count({
            where: { status: PaymentStatus.COMPLETED }
        });
        const failedPayments = await this.paymentRepository.count({
            where: { status: PaymentStatus.FAILED }
        });

        // Refund statistics
        const totalRefunds = await this.refundRepository.count();
        const requestedRefunds = await this.refundRepository.count({
            where: { status: RefundStatus.REQUESTED }
        });
        const approvedRefunds = await this.refundRepository.count({
            where: { status: RefundStatus.APPROVED }
        });
        const completedRefunds = await this.refundRepository.count({
            where: { status: RefundStatus.COMPLETED }
        });

        // Revenue calculations
        const totalRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.status IN (:...statuses)', {
                statuses: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED]
            })
            .getRawOne();

        const totalRefundedAmount = await this.refundRepository
            .createQueryBuilder('refund')
            .select('SUM(refund.amount)', 'total')
            .where('refund.status = :status', { status: RefundStatus.COMPLETED })
            .getRawOne();

        return {
            orders: {
                total: totalOrders,
                pending: pendingOrders,
                paid: paidOrders,
                processing: processingOrders,
                shipped: shippedOrders,
                delivered: deliveredOrders,
                cancelled: cancelledOrders,
                refunded: refundedOrders
            },
            payments: {
                total: totalPayments,
                pending: pendingPayments,
                completed: completedPayments,
                failed: failedPayments
            },
            refunds: {
                total: totalRefunds,
                requested: requestedRefunds,
                approved: approvedRefunds,
                completed: completedRefunds
            },
            revenue: {
                total: parseFloat(totalRevenue?.total || '0'),
                refunded: parseFloat(totalRefundedAmount?.total || '0'),
                net: parseFloat(totalRevenue?.total || '0') - parseFloat(totalRefundedAmount?.total || '0')
            }
        };
    }

    // ============ ANALYTICS & REPORTS ============

    /**
     * Get sales report with date range filtering
     */
    async getSalesReport(startDate?: Date, endDate?: Date) {
        const dateFilter = startDate && endDate ? { createdAt: Between(startDate, endDate) } : {};

        const totalOrders = await this.orderRepository.count({
            where: {
                ...dateFilter,
                status: OrderStatus.DELIVERED
            }
        });

        const totalRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.status = :status', { status: OrderStatus.DELIVERED })
            .andWhere(startDate && endDate ? 'order.createdAt BETWEEN :startDate AND :endDate' : '1=1', {
                startDate,
                endDate
            })
            .getRawOne();

        const totalProductsSold = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoin('order.orderItems', 'orderItem')
            .select('SUM(orderItem.quantity)', 'total')
            .where('order.status = :status', { status: OrderStatus.DELIVERED })
            .andWhere(startDate && endDate ? 'order.createdAt BETWEEN :startDate AND :endDate' : '1=1', {
                startDate,
                endDate
            })
            .getRawOne();

        return {
            period: {
                startDate: startDate?.toISOString().split('T')[0],
                endDate: endDate?.toISOString().split('T')[0]
            },
            totalOrders,
            totalRevenue: parseFloat(totalRevenue?.total || '0'),
            totalProductsSold: parseInt(totalProductsSold?.total || '0'),
            averageOrderValue: totalOrders > 0 ? parseFloat(totalRevenue?.total || '0') / totalOrders : 0
        };
    }

    /**
     * Get revenue dashboard with monthly breakdown
     */
    async getRevenueDashboard(year?: number) {
        const targetYear = year || new Date().getFullYear();

        const monthlyRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('MONTH(order.createdAt)', 'month')
            .addSelect('SUM(order.totalAmount)', 'revenue')
            .addSelect('COUNT(*)', 'orders')
            .where('order.status = :status', { status: OrderStatus.DELIVERED })
            .andWhere('YEAR(order.createdAt) = :year', { year: targetYear })
            .groupBy('MONTH(order.createdAt)')
            .orderBy('MONTH(order.createdAt)', 'ASC')
            .getRawMany();

        const totalYearlyRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.status = :status', { status: OrderStatus.DELIVERED })
            .andWhere('YEAR(order.createdAt) = :year', { year: targetYear })
            .getRawOne();

        const previousYearRevenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.status = :status', { status: OrderStatus.DELIVERED })
            .andWhere('YEAR(order.createdAt) = :year', { year: targetYear - 1 })
            .getRawOne();

        return {
            year: targetYear,
            totalRevenue: parseFloat(totalYearlyRevenue?.total || '0'),
            previousYearRevenue: parseFloat(previousYearRevenue?.total || '0'),
            growthPercentage: previousYearRevenue?.total ?
                ((parseFloat(totalYearlyRevenue?.total || '0') - parseFloat(previousYearRevenue.total)) / parseFloat(previousYearRevenue.total)) * 100 : 0,
            monthlyBreakdown: monthlyRevenue.map(item => ({
                month: parseInt(item.month),
                revenue: parseFloat(item.revenue),
                orders: parseInt(item.orders)
            }))
        };
    }

    /**
     * Get top selling products
     */
    async getTopSellingProducts(limit: number = 10, startDate?: Date, endDate?: Date) {
        const dateFilter = startDate && endDate ? 'AND order.createdAt BETWEEN :startDate AND :endDate' : '';

        const topProducts = await this.orderRepository
            .createQueryBuilder('order')
            .leftJoin('order.orderItems', 'orderItem')
            .leftJoin('orderItem.product', 'product')
            .leftJoin('product.seller', 'seller')
            .select('product.id', 'productId')
            .addSelect('product.name', 'productName')
            .addSelect('product.price', 'price')
            .addSelect('seller.fullName', 'sellerName')
            .addSelect('SUM(orderItem.quantity)', 'totalSold')
            .addSelect('SUM(orderItem.quantity * orderItem.price)', 'totalRevenue')
            .where('order.status = :status', { status: OrderStatus.DELIVERED })
            .andWhere(dateFilter ? 'order.createdAt BETWEEN :startDate AND :endDate' : '1=1', {
                startDate,
                endDate
            })
            .groupBy('product.id')
            .addGroupBy('product.name')
            .addGroupBy('product.price')
            .addGroupBy('seller.fullName')
            .orderBy('SUM(orderItem.quantity)', 'DESC')
            .limit(limit)
            .getRawMany();

        return topProducts.map(item => ({
            productId: item.productId,
            productName: item.productName,
            price: parseFloat(item.price),
            sellerName: item.sellerName,
            totalSold: parseInt(item.totalSold),
            totalRevenue: parseFloat(item.totalRevenue)
        }));
    }

    // ============ SYSTEM SETTINGS ============

    /**
     * Get system settings
     */
    async getSystemSettings() {
        let settings = await this.systemSettingsRepository.findOne({
            where: { id: 1 }
        });

        if (!settings) {
            // Create default settings if not exists
            settings = this.systemSettingsRepository.create({
                deliveryCharge: 50,
                sellerCommission: 10,
                isDeliveryChargeEnabled: true,
                isCommissionEnabled: true
            });
            settings = await this.systemSettingsRepository.save(settings);
        }

        return settings;
    }

    /**
     * Update system settings
     */
    async updateSystemSettings(updateSystemSettingsDto: UpdateSystemSettingsDto) {
        let settings = await this.getSystemSettings();

        if (updateSystemSettingsDto.deliveryCharge !== undefined) {
            settings.deliveryCharge = updateSystemSettingsDto.deliveryCharge;
        }
        if (updateSystemSettingsDto.sellerCommission !== undefined) {
            settings.sellerCommission = updateSystemSettingsDto.sellerCommission;
        }
        if (updateSystemSettingsDto.isDeliveryChargeEnabled !== undefined) {
            settings.isDeliveryChargeEnabled = updateSystemSettingsDto.isDeliveryChargeEnabled;
        }
        if (updateSystemSettingsDto.isCommissionEnabled !== undefined) {
            settings.isCommissionEnabled = updateSystemSettingsDto.isCommissionEnabled;
        }

        return await this.systemSettingsRepository.save(settings);
    }

    // ============ COUPON MANAGEMENT ============

    /**
     * Create a new coupon
     */
    async createCoupon(createCouponDto: CreateCouponDto) {
        const { code, description, type, value, minimumOrderAmount, maximumDiscount, usageLimit, expiresAt } = createCouponDto;

        // Check if coupon code already exists
        const existingCoupon = await this.couponRepository.findOne({
            where: { code }
        });

        if (existingCoupon) {
            throw new BadRequestException('Coupon code already exists');
        }

        // Validate coupon data
        if (type === CouponType.PERCENTAGE && value > 100) {
            throw new BadRequestException('Percentage discount cannot exceed 100%');
        }

        const coupon = this.couponRepository.create({
            code: code.toUpperCase(),
            description,
            type,
            value,
            minimumOrderAmount,
            maximumDiscount,
            usageLimit,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            status: CouponStatus.ACTIVE
        });

        return await this.couponRepository.save(coupon);
    }

    /**
     * Get all coupons
     */
    async getAllCoupons() {
        return await this.couponRepository.find({
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Get active coupons
     */
    async getActiveCoupons() {
        return await this.couponRepository.find({
            where: { status: CouponStatus.ACTIVE },
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Update a coupon
     */
    async updateCoupon(couponId: number, updateCouponDto: UpdateCouponDto) {
        const coupon = await this.couponRepository.findOne({
            where: { id: couponId }
        });

        if (!coupon) {
            throw new NotFoundException(`Coupon with ID ${couponId} not found`);
        }

        // Validate coupon data
        if (updateCouponDto.type === CouponType.PERCENTAGE && updateCouponDto.value && updateCouponDto.value > 100) {
            throw new BadRequestException('Percentage discount cannot exceed 100%');
        }

        if (updateCouponDto.code) {
            // Check if new code conflicts with existing coupons
            const existingCoupon = await this.couponRepository.findOne({
                where: { code: updateCouponDto.code.toUpperCase() }
            });

            if (existingCoupon && existingCoupon.id !== couponId) {
                throw new BadRequestException('Coupon code already exists');
            }
            coupon.code = updateCouponDto.code.toUpperCase();
        }

        if (updateCouponDto.description) coupon.description = updateCouponDto.description;
        if (updateCouponDto.type) coupon.type = updateCouponDto.type;
        if (updateCouponDto.value !== undefined) coupon.value = updateCouponDto.value;
        if (updateCouponDto.minimumOrderAmount !== undefined) coupon.minimumOrderAmount = updateCouponDto.minimumOrderAmount;
        if (updateCouponDto.maximumDiscount !== undefined) coupon.maximumDiscount = updateCouponDto.maximumDiscount;
        if (updateCouponDto.usageLimit !== undefined) coupon.usageLimit = updateCouponDto.usageLimit;
        if (updateCouponDto.expiresAt) coupon.expiresAt = new Date(updateCouponDto.expiresAt);
        if (updateCouponDto.status) coupon.status = updateCouponDto.status;

        return await this.couponRepository.save(coupon);
    }

    /**
     * Delete a coupon
     */
    async deleteCoupon(couponId: number) {
        const coupon = await this.couponRepository.findOne({
            where: { id: couponId }
        });

        if (!coupon) {
            throw new NotFoundException(`Coupon with ID ${couponId} not found`);
        }

        return await this.couponRepository.remove(coupon);
    }

    /**
     * Validate coupon code
     */
    async validateCoupon(code: string, orderAmount: number) {
        const coupon = await this.couponRepository.findOne({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            throw new NotFoundException('Coupon not found');
        }

        if (coupon.status !== CouponStatus.ACTIVE) {
            throw new BadRequestException('Coupon is not active');
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            // Auto-expire coupon
            coupon.status = CouponStatus.EXPIRED;
            await this.couponRepository.save(coupon);
            throw new BadRequestException('Coupon has expired');
        }

        if (coupon.minimumOrderAmount && orderAmount < coupon.minimumOrderAmount) {
            throw new BadRequestException(`Minimum order amount is ${coupon.minimumOrderAmount}`);
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new BadRequestException('Coupon usage limit exceeded');
        }

        return coupon;
    }

    /**
     * Apply coupon discount
     */
    calculateDiscount(coupon: any, orderAmount: number): number {
        let discount = 0;

        if (coupon.type === CouponType.PERCENTAGE) {
            discount = (orderAmount * coupon.value) / 100;
        } else {
            discount = coupon.value;
        }

        // Apply maximum discount limit for percentage coupons
        if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
            discount = coupon.maximumDiscount;
        }

        return Math.min(discount, orderAmount); // Discount cannot exceed order amount
    }
}
