import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { Users } from '../users/entities/user.entity';
import { Address } from './entities/address.entity';
import { Review } from './entities/review.entity';
import { OrderTracking } from './entities/order-tracking.entity';
import { Product, ProductStatus } from '../products/entities/product.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { SearchProductsDto, UpdateProfileDto } from './dto/product-search.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(OrderTracking)
    private orderTrackingRepository: Repository<OrderTracking>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // ============ PROFILE MANAGEMENT ============

  async getProfile(customerId: number): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { id: customerId },
      relations: ['addresses', 'reviews'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(customerId: number, updateProfileDto: UpdateProfileDto): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { id: customerId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateProfileDto);
    return await this.usersRepository.save(user);
  }

  // ============ ADDRESS MANAGEMENT ============

  async createAddress(customerId: number, createAddressDto: CreateAddressDto): Promise<Address> {
    const customer = await this.usersRepository.findOne({
      where: { id: customerId }
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // If setting as default, unset other defaults
    if (createAddressDto.isDefault) {
      await this.addressRepository.update(
        { customer: { id: customerId }, isDefault: true },
        { isDefault: false }
      );
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      customer: { id: customerId } as Users,
    });

    return await this.addressRepository.save(address);
  }

  async getAddresses(customerId: number): Promise<Address[]> {
    return await this.addressRepository.find({
      where: { customer: { id: customerId } },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async getAddressById(customerId: number, addressId: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, customer: { id: customerId } }
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async updateAddress(customerId: number, addressId: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.getAddressById(customerId, addressId);

    // If setting as default, unset other defaults
    if (updateAddressDto.isDefault) {
      await this.addressRepository.update(
        { customer: { id: customerId }, isDefault: true, id: addressId },
        { isDefault: false }
      );
    }

    Object.assign(address, updateAddressDto);
    return await this.addressRepository.save(address);
  }

  async deleteAddress(customerId: number, addressId: number): Promise<void> {
    const address = await this.getAddressById(customerId, addressId);
    await this.addressRepository.remove(address);
  }

  async setDefaultAddress(customerId: number, addressId: number): Promise<Address> {
    const address = await this.getAddressById(customerId, addressId);

    // Unset other defaults
    await this.addressRepository.update(
      { customer: { id: customerId }, isDefault: true },
      { isDefault: false }
    );

    address.isDefault = true;
    return await this.addressRepository.save(address);
  }

  // ============ PRODUCT BROWSING & SEARCH ============

  async searchProducts(searchDto: SearchProductsDto): Promise<{ data: Product[]; total: number }> {
    const { query, categoryId, minPrice, maxPrice, sortBy = 'newest', page = 1, limit = 20 } = searchDto;

    const where: any = { status: ProductStatus.APPROVED };

    if (query) {
      where.name = Like(`%${query}%`);
    }

    if (categoryId) {
      where.category = { id: categoryId };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = Between(minPrice || 0, maxPrice || 999999);
    }

    let orderBy: any = { createdAt: 'DESC' };
    switch (sortBy) {
      case 'price':
        orderBy = { price: 'ASC' };
        break;
      case 'rating':
        // Would need a view or computed field
        orderBy = { createdAt: 'DESC' };
        break;
      case 'popular':
        orderBy = { createdAt: 'DESC' };
        break;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category', 'seller', 'reviews'],
      order: orderBy,
      skip,
      take: limit,
    });

    return { data, total };
  }

  async getProductDetails(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category', 'seller', 'reviews', 'reviews.customer'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== ProductStatus.APPROVED) {
      throw new ForbiddenException('Product is not available');
    }

    return product;
  }

  // ============ REVIEW & RATING ============

  async createReview(customerId: number, createReviewDto: CreateReviewDto): Promise<Review> {
    const { productId, orderId, ...reviewData } = createReviewDto;

    // Verify product exists
    const product = await this.productRepository.findOne({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await this.reviewRepository.findOne({
      where: {
        customer: { id: customerId },
        product: { id: productId }
      }
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    // If orderId provided, verify it's a valid order for this customer
    let order: Order | null = null;
    if (orderId) {
      order = await this.orderRepository.findOne({
        where: { id: orderId, customer: { id: customerId } }
      });

      if (!order) {
        throw new BadRequestException('Order not found');
      }
    }

    const review = this.reviewRepository.create({
      ...reviewData,
      customer: { id: customerId } as Users,
      product: { id: productId } as Product,
      order: order || undefined,
      isVerifiedPurchase: !!order,
    });

    return await this.reviewRepository.save(review);
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMyReviews(customerId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { customer: { id: customerId } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateReview(customerId: number, reviewId: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, customer: { id: customerId } }
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async deleteReview(customerId: number, reviewId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, customer: { id: customerId } }
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewRepository.remove(review);
  }

  // ============ ORDER TRACKING ============

  async getMyOrders(customerId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { customer: { id: customerId } },
      relations: ['orderItems', 'orderItems.product', 'trackingHistory'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(customerId: number, orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, customer: { id: customerId } },
      relations: ['orderItems', 'orderItems.product', 'trackingHistory', 'payments'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getOrderTrackingHistory(customerId: number, orderId: number): Promise<OrderTracking[]> {
    // Verify order belongs to customer
    await this.getOrderById(customerId, orderId);

    return await this.orderTrackingRepository.find({
      where: { order: { id: orderId } },
      order: { timestamp: 'DESC' },
    });
  }

  async addTrackingUpdate(orderId: number, status: OrderStatus, description?: string, note?: string): Promise<OrderTracking> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const tracking = this.orderTrackingRepository.create({
      status,
      description,
      note,
      order: { id: orderId } as Order,
    });

    return await this.orderTrackingRepository.save(tracking);
  }

  // ============ CUSTOMER SUPPORT ============

  async requestReturn(customerId: number, orderId: number, reason: string): Promise<any> {
    const order = await this.getOrderById(customerId, orderId);

    if (order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Only delivered orders can be returned');
    }

    // Return request would be stored separately or in the Message entity
    return {
      message: 'Return request submitted successfully',
      orderId,
      reason,
      status: 'pending'
    };
  }

  async getNotifications(customerId: number): Promise<any[]> {
    // Get order status updates from tracking history
    const orderIds = (await this.orderRepository.find({
      where: { customer: { id: customerId } },
      select: ['id']
    })).map(o => o.id);

    if (orderIds.length === 0) {
      return [];
    }

    const trackingUpdates = await this.orderTrackingRepository.find({
      where: { order: { id: In(orderIds) } },
      relations: ['order'],
      order: { timestamp: 'DESC' },
      take: 10,
    });

    return trackingUpdates.map(update => ({
      id: update.id,
      type: 'order_update',
      title: `Order #${update.order.id} - ${update.status}`,
      description: update.description,
      timestamp: update.timestamp,
    }));
  }
}