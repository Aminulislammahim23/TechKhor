import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Request
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwtGuard.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { OrdersService, CreateOrderDto, CreatePaymentDto, CreateRefundDto } from './orders.service';
import { OrderStatus } from './entities/order.entity';
import { PaymentMethod } from './entities/payment.entity';
import { RefundReason } from './entities/refund.entity';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // ============ PUBLIC/CUSTOMER ENDPOINTS ============

  /**
   * Create a new order (Customer)
   * POST /orders
   */
  @Post()
  @UseGuards(JwtGuard)
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    // Override customerId with authenticated user
    createOrderDto.customerId = req.user.userId;
    return await this.ordersService.createOrder(createOrderDto);
  }

  /**
   * Get customer's orders (Customer)
   * GET /orders/my-orders
   */
  @Get('my-orders')
  @UseGuards(JwtGuard)
  async getMyOrders(@Request() req) {
    return await this.ordersService.getOrdersByCustomer(req.user.userId);
  }

  /**
   * Get customer's order by ID (Customer)
   * GET /orders/my-orders/:id
   */
  @Get('my-orders/:id')
  @UseGuards(JwtGuard)
  async getMyOrderById(@Param('id') id: string, @Request() req) {
    const order = await this.ordersService.getOrderById(Number(id));

    // Check if order belongs to customer
    if (order.customer.id !== req.user.userId) {
      throw new Error('Access denied');
    }

    return order;
  }

  /**
   * Request refund for order (Customer)
   * POST /orders/:orderId/refund
   */
  @Post(':orderId/refund')
  @UseGuards(JwtGuard)
  async requestRefund(
    @Param('orderId') orderId: string,
    @Body() createRefundDto: CreateRefundDto,
    @Request() req
  ) {
    createRefundDto.orderId = Number(orderId);
    return await this.ordersService.createRefund(createRefundDto, req.user.userId);
  }

  // ============ ADMIN ENDPOINTS ============

  /**
   * Get all orders (Admin)
   * GET /admin/orders/orders
   */
  @Get('admin/orders')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllOrders() {
    return await this.ordersService.getAllOrders();
  }

  /**
   * Get order by ID (Admin)
   * GET /admin/orders/orders/:id
   */
  @Get('admin/orders/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getOrderById(@Param('id') id: string) {
    return await this.ordersService.getOrderById(Number(id));
  }

  /**
   * Update order status (Admin)
   * PUT /admin/orders/orders/:id/status
   */
  @Put('admin/orders/:id/status')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus
  ) {
    return await this.ordersService.updateOrderStatus(Number(id), status);
  }

  /**
   * Get all payments (Admin)
   * GET /admin/orders/payments
   */
  @Get('admin/payments')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllPayments() {
    return await this.ordersService.getAllPayments();
  }

  /**
   * Create payment record (Admin)
   * POST /admin/orders/payments
   */
  @Post('admin/payments')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return await this.ordersService.createPayment(createPaymentDto, req.user.userId);
  }

  /**
   * Verify payment (Admin)
   * POST /admin/orders/payments/:paymentId/verify
   */
  @Post('admin/payments/:paymentId/verify')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async verifyPayment(@Param('paymentId') paymentId: string, @Request() req) {
    return await this.ordersService.verifyPayment(Number(paymentId), req.user.userId);
  }

  /**
   * Get payments by order (Admin)
   * GET /admin/orders/orders/:orderId/payments
   */
  @Get('admin/orders/:orderId/payments')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getPaymentsByOrder(@Param('orderId') orderId: string) {
    return await this.ordersService.getPaymentsByOrder(Number(orderId));
  }

  /**
   * Get all refunds (Admin)
   * GET /admin/orders/refunds
   */
  @Get('admin/refunds')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllRefunds() {
    return await this.ordersService.getAllRefunds();
  }

  /**
   * Get pending refunds (Admin)
   * GET /admin/orders/refunds/pending
   */
  @Get('admin/refunds/pending')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getPendingRefunds() {
    return await this.ordersService.getPendingRefunds();
  }

  /**
   * Approve refund (Admin)
   * POST /admin/orders/refunds/:refundId/approve
   */
  @Post('admin/refunds/:refundId/approve')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async approveRefund(
    @Param('refundId') refundId: string,
    @Body('adminNotes') adminNotes: string,
    @Request() req
  ) {
    return await this.ordersService.approveRefund(Number(refundId), req.user.userId, adminNotes);
  }

  /**
   * Reject refund (Admin)
   * POST /admin/orders/refunds/:refundId/reject
   */
  @Post('admin/refunds/:refundId/reject')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async rejectRefund(
    @Param('refundId') refundId: string,
    @Body('adminNotes') adminNotes: string,
    @Request() req
  ) {
    return await this.ordersService.rejectRefund(Number(refundId), req.user.userId, adminNotes);
  }

  /**
   * Process refund (Admin)
   * POST /admin/orders/refunds/:refundId/process
   */
  @Post('admin/refunds/:refundId/process')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async processRefund(
    @Param('refundId') refundId: string,
    @Body('transactionId') transactionId: string
  ) {
    return await this.ordersService.processRefund(Number(refundId), transactionId);
  }

  /**
   * Complete refund (Admin)
   * POST /admin/orders/refunds/:refundId/complete
   */
  @Post('admin/refunds/:refundId/complete')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async completeRefund(@Param('refundId') refundId: string) {
    return await this.ordersService.completeRefund(Number(refundId));
  }

  /**
   * Get refunds by order (Admin)
   * GET /admin/orders/orders/:orderId/refunds
   */
  @Get('admin/orders/:orderId/refunds')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getRefundsByOrder(@Param('orderId') orderId: string) {
    return await this.ordersService.getRefundsByOrder(Number(orderId));
  }

  // ============ STATISTICS ENDPOINTS ============

  /**
   * Get order statistics (Admin)
   * GET /admin/orders/statistics/orders
   */
  @Get('admin/statistics/orders')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getOrderStatistics() {
    return await this.ordersService.getOrderStatistics();
  }

  /**
   * Get payment statistics (Admin)
   * GET /admin/orders/statistics/payments
   */
  @Get('admin/statistics/payments')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getPaymentStatistics() {
    return await this.ordersService.getPaymentStatistics();
  }

  /**
   * Get refund statistics (Admin)
   * GET /admin/orders/statistics/refunds
   */
  @Get('admin/statistics/refunds')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getRefundStatistics() {
    return await this.ordersService.getRefundStatistics();
  }

  /**
   * Get comprehensive order dashboard (Admin)
   * GET /admin/orders/dashboard
   */
  @Get('admin/dashboard')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getOrderDashboard() {
    const [orderStats, paymentStats, refundStats] = await Promise.all([
      this.ordersService.getOrderStatistics(),
      this.ordersService.getPaymentStatistics(),
      this.ordersService.getRefundStatistics()
    ]);

    return {
      orders: orderStats,
      payments: paymentStats,
      refunds: refundStats
    };
  }
}
