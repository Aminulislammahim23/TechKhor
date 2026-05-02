import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  // 👉 Create Payment
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePaymentDto, @Req() req) {
    return this.service.create(req.user, dto);
  }

  // 👉 My Payments
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  findAllForAdmin() {
    return this.service.findAllForAdmin();
  }

  // 👉 Single Payment
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @Get('seller/pending-approvals')
  findPendingApprovalsForSeller(@Req() req) {
    return this.service.findPendingApprovalsForSeller(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  @Post(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.service.approvePayment(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.service.findOneForUser(id, req.user);
  }
}
