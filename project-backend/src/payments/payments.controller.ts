import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  // 👉 Create Payment
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto, @Req() req) {
    return this.service.create(req.user.id, dto);
  }

  // 👉 My Payments
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.id);
  }

  // 👉 Single Payment
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }
}