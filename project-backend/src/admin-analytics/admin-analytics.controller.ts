import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminAnalyticsService } from './admin-analytics.service';

@Controller('admin')
export class AdminAnalyticsController {
  constructor(private readonly service: AdminAnalyticsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('analytics')
  getAnalytics() {
    return this.service.getOverview();
  }
}
