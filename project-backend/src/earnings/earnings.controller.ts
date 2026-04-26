import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EarningsService } from './earnings.service';

@Controller()
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @Get('seller/earnings')
  findForSeller(@Req() req) {
    return this.earningsService.findForSeller(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/seller-earnings')
  findAllForAdmin() {
    return this.earningsService.findAllForAdmin();
  }
}
