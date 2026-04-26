import {
  Controller, Get, Param,
  Patch, Delete, Body, UseGuards, Post, ParseIntPipe, Query
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create-seller')
  createSeller(@Body() dto: CreateUserDto) {
    return this.service.createSeller(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('sellers')
  findSellers() {
    return this.service.findSellers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('sellers/:id')
  removeSeller(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeSeller(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('sellers/:id/maintenance-access')
  setSellerMaintenanceAccess(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { enabled?: boolean },
  ) {
    return this.service.setSellerMaintenanceAccess(id, Boolean(body?.enabled));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller', 'admin')
  @Get('customers/lookup')
  lookupCustomerByPhone(@Query('phone') phone: string) {
    return this.service.lookupCustomerByPhone(phone);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
