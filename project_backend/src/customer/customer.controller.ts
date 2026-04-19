import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { SearchProductsDto, UpdateProfileDto } from './dto/product-search.dto';
import { JwtGuard } from '../auth/jwt/jwtGuard.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/roles/roles.guard';

@Controller('customer')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.CUSTOMER)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // ============ PROFILE MANAGEMENT ============

  @Get('profile')
  async getProfile(@Request() req) {
    return await this.customerService.getProfile(req.user.userId);
  }

  @Put('profile')
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req,
  ) {
    return await this.customerService.updateProfile(req.user.userId, updateProfileDto);
  }

  // ============ ADDRESS MANAGEMENT ============

  @Post('addresses')
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @Request() req,
  ) {
    return await this.customerService.createAddress(req.user.userId, createAddressDto);
  }

  @Get('addresses')
  async getAddresses(@Request() req) {
    return await this.customerService.getAddresses(req.user.userId);
  }

  @Get('addresses/:id')
  async getAddressById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return await this.customerService.getAddressById(req.user.userId, id);
  }

  @Put('addresses/:id')
  async updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
    @Request() req,
  ) {
    return await this.customerService.updateAddress(req.user.userId, id, updateAddressDto);
  }

  @Delete('addresses/:id')
  async deleteAddress(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    await this.customerService.deleteAddress(req.user.userId, id);
    return { message: 'Address deleted successfully' };
  }

  @Put('addresses/:id/set-default')
  async setDefaultAddress(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return await this.customerService.setDefaultAddress(req.user.userId, id);
  }

  // ============ PRODUCT BROWSING & SEARCH ============

  @Post('products/search')
  async searchProducts(@Body() searchDto: SearchProductsDto) {
    return await this.customerService.searchProducts(searchDto);
  }

  @Get('products/:id')
  async getProductDetails(@Param('id', ParseIntPipe) id: number) {
    return await this.customerService.getProductDetails(id);
  }

  // ============ REVIEW & RATING ============

  @Post('reviews')
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ) {
    return await this.customerService.createReview(req.user.userId, createReviewDto);
  }

  @Get('products/:productId/reviews')
  async getProductReviews(@Param('productId', ParseIntPipe) productId: number) {
    return await this.customerService.getProductReviews(productId);
  }

  @Get('reviews')
  async getMyReviews(@Request() req) {
    return await this.customerService.getMyReviews(req.user.userId);
  }

  @Put('reviews/:id')
  async updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    return await this.customerService.updateReview(req.user.userId, id, updateReviewDto);
  }

  @Delete('reviews/:id')
  async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    await this.customerService.deleteReview(req.user.userId, id);
    return { message: 'Review deleted successfully' };
  }

  // ============ ORDER MANAGEMENT ============

  @Get('orders')
  async getMyOrders(@Request() req) {
    return await this.customerService.getMyOrders(req.user.userId);
  }

  @Get('orders/:id')
  async getOrderById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return await this.customerService.getOrderById(req.user.userId, id);
  }

  @Get('orders/:id/tracking')
  async getOrderTrackingHistory(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return await this.customerService.getOrderTrackingHistory(req.user.userId, id);
  }

  // ============ SUPPORT & NOTIFICATIONS ============

  @Post('orders/:id/return-request')
  async requestReturn(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @Request() req,
  ) {
    return await this.customerService.requestReturn(req.user.userId, id, reason);
  }

  @Get('notifications')
  async getNotifications(@Request() req) {
    return await this.customerService.getNotifications(req.user.userId);
  }
}