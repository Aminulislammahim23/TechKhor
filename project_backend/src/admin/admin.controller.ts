import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
    Put,
    Delete,
    Query,
    Request
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwtGuard.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ApproveSellerDto } from './dto/approve-seller.dto';
import { BanCustomerDto } from './dto/ban-customer.dto';
import { ApproveProductDto } from './dto/approve-product.dto';
import { RejectProductDto } from './dto/reject-product.dto';
import { RemoveProductDto } from './dto/remove-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateSystemSettingsDto } from './dto/system-settings.dto';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
    constructor(private adminService: AdminService) {}

    // ============ SELLER MANAGEMENT ============

    /**
     * Get all sellers with pending approval status
     * GET /admin/sellers/pending
     */
    @Get('sellers/pending')
    async getPendingSellers() {
        return await this.adminService.getPendingSellers();
    }

    /**
     * Get all approved sellers
     * GET /admin/sellers/approved
     */
    @Get('sellers/approved')
    async getApprovedSellers() {
        return await this.adminService.getApprovedSellers();
    }

    /**
     * Get all sellers
     * GET /admin/sellers
     */
    @Get('sellers')
    async getAllSellers() {
        return await this.adminService.getAllSellers();
    }

    /**
     * Approve a seller
     * POST /admin/sellers/approve
     * Body: { sellerId: number }
     */
    @Post('sellers/approve')
    @HttpCode(HttpStatus.OK)
    async approveSeller(@Body() approveSellersDto: ApproveSellerDto) {
        return await this.adminService.approveSeller(approveSellersDto);
    }

    /**
     * Reject a seller
     * POST /admin/sellers/reject/:sellerId
     */
    @Post('sellers/reject/:sellerId')
    @HttpCode(HttpStatus.OK)
    async rejectSeller(@Param('sellerId') sellerId: string) {
        return await this.adminService.rejectSeller(Number(sellerId));
    }

    // ============ CUSTOMER MANAGEMENT ============

    /**
     * Get all customers
     * GET /admin/customers
     */
    @Get('customers')
    async getAllCustomers() {
        return await this.adminService.getAllCustomers();
    }

    /**
     * Get all active customers
     * GET /admin/customers/active
     */
    @Get('customers/active')
    async getActiveCustomers() {
        return await this.adminService.getActiveCustomers();
    }

    /**
     * Get all banned customers
     * GET /admin/customers/banned
     */
    @Get('customers/banned')
    async getBannedCustomers() {
        return await this.adminService.getBannedCustomers();
    }

    /**
     * Ban a customer
     * POST /admin/customers/ban
     * Body: { customerId: number }
     */
    @Post('customers/ban')
    @HttpCode(HttpStatus.OK)
    async banCustomer(@Body() banCustomerDto: BanCustomerDto) {
        return await this.adminService.banCustomer(banCustomerDto);
    }

    /**
     * Unblock (unban) a customer
     * POST /admin/customers/unblock/:customerId
     */
    @Post('customers/unblock/:customerId')
    @HttpCode(HttpStatus.OK)
    async unblockCustomer(@Param('customerId') customerId: string) {
        return await this.adminService.unblockCustomer(Number(customerId));
    }

    // ============ ADMIN MANAGEMENT ============

    /**
     * Create a new admin account
     * POST /admin/admins/create
     * Body: { email, password, fullName }
     */
    @Post('admins/create')
    @HttpCode(HttpStatus.CREATED)
    async createAdmin(@Body() createAdminDto: CreateAdminDto) {
        return await this.adminService.createAdmin(createAdminDto);
    }

    /**
     * Get all admin accounts
     * GET /admin/admins
     */
    @Get('admins')
    async getAllAdmins() {
        return await this.adminService.getAllAdmins();
    }

    // ============ SYSTEM OVERVIEW ============

    /**
     * Get all users in the system
     * GET /admin/users
     */
    @Get('users')
    async getAllUsers() {
        return await this.adminService.getAllUsers();
    }

    /**
     * Get user statistics
     * GET /admin/statistics
     */
    @Get('statistics')
    async getUserStatistics() {
        return await this.adminService.getUserStatistics();
    }

    // ============ PRODUCT MANAGEMENT ============

    /**
     * Get all products pending review
     * GET /admin/products/pending
     */
    @Get('products/pending')
    async getPendingProducts() {
        return await this.adminService.getPendingProducts();
    }

    /**
     * Get all approved products
     * GET /admin/products/approved
     */
    @Get('products/approved')
    async getApprovedProducts() {
        return await this.adminService.getApprovedProducts();
    }

    /**
     * Get all rejected products
     * GET /admin/products/rejected
     */
    @Get('products/rejected')
    async getRejectedProducts() {
        return await this.adminService.getRejectedProducts();
    }

    /**
     * Get all removed (fake/low quality) products
     * GET /admin/products/removed
     */
    @Get('products/removed')
    async getRemovedProducts() {
        return await this.adminService.getRemovedProducts();
    }

    /**
     * Get all products for review
     * GET /admin/products/review
     */
    @Get('products/review')
    async getProductsForReview() {
        return await this.adminService.getProductsForReview();
    }

    /**
     * Get products by seller for review
     * GET /admin/products/seller/:sellerId
     */
    @Get('products/seller/:sellerId')
    async getSellerProductsForReview(@Param('sellerId') sellerId: string) {
        return await this.adminService.getSellerProductsForReview(Number(sellerId));
    }

    /**
     * Approve a product
     * POST /admin/products/approve
     * Body: { productId: number }
     */
    @Post('products/approve')
    @HttpCode(HttpStatus.OK)
    async approveProduct(@Body() approveProductDto: ApproveProductDto) {
        return await this.adminService.approveProduct(approveProductDto);
    }

    /**
     * Reject a product
     * POST /admin/products/reject
     * Body: { productId: number, reason?: string }
     */
    @Post('products/reject')
    @HttpCode(HttpStatus.OK)
    async rejectProduct(@Body() rejectProductDto: RejectProductDto) {
        return await this.adminService.rejectProduct(rejectProductDto);
    }

    /**
     * Remove a product (fake/low quality)
     * POST /admin/products/remove
     * Body: { productId: number, reason?: string }
     */
    @Post('products/remove')
    @HttpCode(HttpStatus.OK)
    async removeProduct(@Body() removeProductDto: RemoveProductDto) {
        return await this.adminService.removeProduct(
            removeProductDto.productId,
            removeProductDto.reason
        );
    }

    /**
     * Get product statistics
     * GET /admin/products/stats
     */
    @Get('products/stats')
    async getProductStatistics() {
        return await this.adminService.getProductStatistics();
    }

    // ============ CATEGORY MANAGEMENT ============

    /**
     * Create a new category
     * POST /admin/categories
     * Body: { name, description?, image? }
     */
    @Post('categories')
    @HttpCode(HttpStatus.CREATED)
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return await this.adminService.createCategory(
            createCategoryDto.name,
            createCategoryDto.description,
            createCategoryDto.image
        );
    }

    /**
     * Get all categories
     * GET /admin/categories
     */
    @Get('categories')
    async getAllCategories() {
        return await this.adminService.getAllCategories();
    }

    /**
     * Update a category
     * PUT /admin/categories/:id
     * Body: { name?, description?, image? }
     */
    @Put('categories/:id')
    @HttpCode(HttpStatus.OK)
    async updateCategory(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ) {
        return await this.adminService.updateCategory(
            Number(id),
            updateCategoryDto.name,
            updateCategoryDto.description,
            updateCategoryDto.image
        );
    }

    /**
     * Delete a category
     * DELETE /admin/categories/:id
     */
    @Delete('categories/:id')
    @HttpCode(HttpStatus.OK)
    async deleteCategory(@Param('id') id: string) {
        return await this.adminService.deleteCategory(Number(id));
    }

    // ============ ORDER MONITORING ============

    /**
     * Get comprehensive order dashboard (Admin)
     * GET /admin/orders/dashboard
     */
    @Get('orders/dashboard')
    async getOrderTransactionStatistics() {
        return await this.adminService.getOrderTransactionStatistics();
    }

    /**
     * Get all orders (Admin)
     * GET /admin/orders/orders
     */
    @Get('orders/orders')
    async getAllOrders() {
        return await this.adminService.getAllOrders();
    }

    /**
     * Get orders by status (Admin)
     * GET /admin/orders/orders/status/:status
     */
    @Get('orders/orders/status/:status')
    async getOrdersByStatus(@Param('status') status: string) {
        return await this.adminService.getOrdersByStatus(status as any);
    }

    /**
     * Get recent orders (Admin)
     * GET /admin/orders/orders/recent
     */
    @Get('orders/orders/recent')
    async getRecentOrders(@Query('days') days?: string) {
        return await this.adminService.getRecentOrders(days ? Number(days) : 30);
    }

    /**
     * Get order details (Admin)
     * GET /admin/orders/orders/:id
     */
    @Get('orders/orders/:id')
    async getOrderDetails(@Param('id') id: string) {
        return await this.adminService.getOrderDetails(Number(id));
    }

    /**
     * Get all payments (Admin)
     * GET /admin/orders/payments
     */
    @Get('orders/payments')
    async getAllPayments() {
        return await this.adminService.getAllPayments();
    }

    /**
     * Get payments by status (Admin)
     * GET /admin/orders/payments/status/:status
     */
    @Get('orders/payments/status/:status')
    async getPaymentsByStatus(@Param('status') status: string) {
        return await this.adminService.getPaymentsByStatus(status as any);
    }

    /**
     * Get pending payments (Admin)
     * GET /admin/orders/payments/pending
     */
    @Get('orders/payments/pending')
    async getPendingPayments() {
        return await this.adminService.getPendingPayments();
    }

    /**
     * Verify payment (Admin)
     * POST /admin/orders/payments/:paymentId/verify
     */
    @Post('orders/payments/:paymentId/verify')
    @HttpCode(HttpStatus.OK)
    async verifyPayment(@Param('paymentId') paymentId: string, @Request() req) {
        return await this.adminService.verifyPayment(Number(paymentId), req.user.userId);
    }

    /**
     * Get all refunds (Admin)
     * GET /admin/orders/refunds
     */
    @Get('orders/refunds')
    async getAllRefunds() {
        return await this.adminService.getAllRefunds();
    }

    /**
     * Get pending refunds (Admin)
     * GET /admin/orders/refunds/pending
     */
    @Get('orders/refunds/pending')
    async getPendingRefunds() {
        return await this.adminService.getPendingRefunds();
    }

    /**
     * Approve refund (Admin)
     * POST /admin/orders/refunds/:refundId/approve
     */
    @Post('orders/refunds/:refundId/approve')
    @HttpCode(HttpStatus.OK)
    async approveRefund(
        @Param('refundId') refundId: string,
        @Body('adminNotes') adminNotes: string,
        @Request() req
    ) {
        return await this.adminService.approveRefund(Number(refundId), req.user.userId, adminNotes);
    }

    /**
     * Reject refund (Admin)
     * POST /admin/orders/refunds/:refundId/reject
     */
    @Post('orders/refunds/:refundId/reject')
    @HttpCode(HttpStatus.OK)
    async rejectRefund(
        @Param('refundId') refundId: string,
        @Body('adminNotes') adminNotes: string,
        @Request() req
    ) {
        return await this.adminService.rejectRefund(Number(refundId), req.user.userId, adminNotes);
    }

    // ============ ANALYTICS & REPORTS ============

    /**
     * Get sales report (Admin)
     * GET /admin/analytics/sales-report
     */
    @Get('analytics/sales-report')
    async getSalesReport(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return await this.adminService.getSalesReport(start, end);
    }

    /**
     * Get revenue dashboard (Admin)
     * GET /admin/analytics/revenue-dashboard
     */
    @Get('analytics/revenue-dashboard')
    async getRevenueDashboard(@Query('year') year?: string) {
        return await this.adminService.getRevenueDashboard(year ? Number(year) : undefined);
    }

    /**
     * Get top selling products (Admin)
     * GET /admin/analytics/top-products
     */
    @Get('analytics/top-products')
    async getTopSellingProducts(
        @Query('limit') limit?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return await this.adminService.getTopSellingProducts(
            limit ? Number(limit) : 10,
            start,
            end
        );
    }

    // ============ SYSTEM SETTINGS ============

    /**
     * Get system settings (Admin)
     * GET /admin/settings/system
     */
    @Get('settings/system')
    async getSystemSettings() {
        return await this.adminService.getSystemSettings();
    }

    /**
     * Update system settings (Admin)
     * PUT /admin/settings/system
     */
    @Put('settings/system')
    @HttpCode(HttpStatus.OK)
    async updateSystemSettings(@Body() updateSystemSettingsDto: UpdateSystemSettingsDto) {
        return await this.adminService.updateSystemSettings(updateSystemSettingsDto);
    }

    // ============ COUPON MANAGEMENT ============

    /**
     * Create a new coupon (Admin)
     * POST /admin/coupons
     */
    @Post('coupons')
    @HttpCode(HttpStatus.CREATED)
    async createCoupon(@Body() createCouponDto: CreateCouponDto) {
        return await this.adminService.createCoupon(createCouponDto);
    }

    /**
     * Get all coupons (Admin)
     * GET /admin/coupons
     */
    @Get('coupons')
    async getAllCoupons() {
        return await this.adminService.getAllCoupons();
    }

    /**
     * Get active coupons (Admin)
     * GET /admin/coupons/active
     */
    @Get('coupons/active')
    async getActiveCoupons() {
        return await this.adminService.getActiveCoupons();
    }

    /**
     * Update a coupon (Admin)
     * PUT /admin/coupons/:id
     */
    @Put('coupons/:id')
    @HttpCode(HttpStatus.OK)
    async updateCoupon(
        @Param('id') id: string,
        @Body() updateCouponDto: UpdateCouponDto
    ) {
        return await this.adminService.updateCoupon(Number(id), updateCouponDto);
    }

    /**
     * Delete a coupon (Admin)
     * DELETE /admin/coupons/:id
     */
    @Delete('coupons/:id')
    @HttpCode(HttpStatus.OK)
    async deleteCoupon(@Param('id') id: string) {
        return await this.adminService.deleteCoupon(Number(id));
    }

    /**
     * Validate coupon (Admin)
     * POST /admin/coupons/validate
     */
    @Post('coupons/validate')
    @HttpCode(HttpStatus.OK)
    async validateCoupon(
        @Body('code') code: string,
        @Body('orderAmount') orderAmount: number
    ) {
        const coupon = await this.adminService.validateCoupon(code, orderAmount);
        const discount = this.adminService.calculateDiscount(coupon, orderAmount);
        return {
            coupon,
            discount,
            finalAmount: orderAmount - discount
        };
    }
}
