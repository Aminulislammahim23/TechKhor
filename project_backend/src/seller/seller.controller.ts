import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateWithdrawRequestDto } from './dto/create-withdraw-request.dto';
import { CreateMessageDto, ReplyMessageDto } from './dto/create-message.dto';
import { JwtGuard } from '../auth/jwt/jwtGuard.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/roles/roles.guard';
import { OrderStatus } from '../orders/entities/order.entity';

@Controller('seller')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.SELLER)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  // ============ PRODUCT MANAGEMENT ============

  @Post('products')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
  ) {
    return await this.sellerService.createProduct(req.user.userId, createProductDto);
  }

  @Get('products')
  async getMyProducts(@Request() req) {
    return await this.sellerService.getMyProducts(req.user.userId);
  }

  @Get('products/:id')
  async getProductById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return await this.sellerService.getProductById(req.user.userId, id);
  }

  @Put('products/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    return await this.sellerService.updateProduct(req.user.userId, id, updateProductDto);
  }

  @Put('products/:id/price')
  async updateProductPrice(
    @Param('id', ParseIntPipe) id: number,
    @Body('price', ParseIntPipe) price: number,
    @Request() req,
  ) {
    return await this.sellerService.updateProductPrice(req.user.userId, id, price);
  }

  @Put('products/:id/stock')
  async updateProductStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('stock', ParseIntPipe) stock: number,
    @Request() req,
  ) {
    return await this.sellerService.updateProductStock(req.user.userId, id, stock);
  }

  @Delete('products/:id')
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    await this.sellerService.deleteProduct(req.user.userId, id);
    return { message: 'Product deleted successfully' };
  }

  // ============ ORDER MANAGEMENT ============

  @Get('orders')
  async getMyOrders(@Request() req) {
    return await this.sellerService.getMyOrders(req.user.userId);
  }

  @Get('orders/:id')
  async getOrderById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return await this.sellerService.getOrderById(req.user.userId, id);
  }

  @Put('orders/:id/status')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
    @Request() req,
  ) {
    return await this.sellerService.updateOrderStatus(req.user.userId, id, status);
  }

  // ============ INVENTORY MANAGEMENT ============

  @Get('inventory/low-stock')
  async getLowStockProducts(@Request() req) {
    return await this.sellerService.getLowStockProducts(req.user.userId);
  }

  @Get('inventory/alerts')
  async getLowStockAlerts(
    @Request() req,
    @Query('threshold', ParseIntPipe) threshold?: number,
  ) {
    return await this.sellerService.getLowStockAlerts(req.user.userId, threshold);
  }

  // ============ EARNINGS & REPORTS ============

  @Get('earnings')
  async getEarnings(@Request() req) {
    return await this.sellerService.getEarnings(req.user.userId);
  }

  @Get('reports/sales')
  async getSalesReport(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return await this.sellerService.getSalesReport(req.user.userId, start, end);
  }

  @Post('withdrawals')
  async createWithdrawRequest(
    @Body() createWithdrawRequestDto: CreateWithdrawRequestDto,
    @Request() req,
  ) {
    return await this.sellerService.createWithdrawRequest(req.user.userId, createWithdrawRequestDto);
  }

  @Get('withdrawals')
  async getWithdrawRequests(@Request() req) {
    return await this.sellerService.getWithdrawRequests(req.user.userId);
  }

  // ============ CUSTOMER INTERACTION ============

  @Get('messages')
  async getMessages(@Request() req) {
    return await this.sellerService.getMessages(req.user.userId);
  }

  @Post('messages')
  async sendMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
  ) {
    return await this.sellerService.sendMessage(req.user.userId, createMessageDto);
  }

  @Post('messages/:id/reply')
  async replyToMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() replyDto: ReplyMessageDto,
    @Request() req,
  ) {
    return await this.sellerService.replyToMessage(req.user.userId, id, replyDto);
  }

  @Get('questions')
  async getProductQuestions(@Request() req) {
    return await this.sellerService.getProductQuestions(req.user.userId);
  }
}