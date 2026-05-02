import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get('my')
  findMine(@Req() req) {
    return this.service.findMine(req.user.id);
  }

  @Patch('read-all')
  markAllRead(@Req() req) {
    return this.service.markAllRead(req.user.id);
  }

  @Patch(':id/read')
  markRead(@Req() req, @Param('id') id: string) {
    return this.service.markRead(req.user.id, Number(id));
  }
}
