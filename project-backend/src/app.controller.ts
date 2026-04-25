import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('maintenance/status')
  getPublicMaintenanceStatus() {
    return this.appService.getMaintenanceStatus();
  }

  @UseGuards(JwtAuthGuard)
  @Get('maintenance/access')
  async getMaintenanceAccess(@Req() req) {
    const { maintenanceMode } = this.appService.getMaintenanceStatus();

    if (!maintenanceMode) {
      return { allowed: true, maintenanceMode };
    }

    if (req.user?.role === 'admin') {
      return { allowed: true, maintenanceMode };
    }

    if (req.user?.role === 'seller') {
      const seller = await this.usersService.findById(req.user.id);
      return {
        allowed: Boolean(seller.canAccessDuringMaintenance),
        maintenanceMode,
      };
    }

    return { allowed: false, maintenanceMode };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/settings/maintenance')
  getMaintenanceStatus() {
    return this.appService.getMaintenanceStatus();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/settings/maintenance')
  setMaintenanceStatus(@Body() body: { maintenanceMode?: boolean }) {
    return this.appService.setMaintenanceMode(Boolean(body?.maintenanceMode));
  }
}
