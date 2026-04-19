import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './jwt/jwtGuard.guard';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { Public } from './decorators/public.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() userRegistrationDTO: UserRegistrationDto) {
    return await this.authService.registerUser(userRegistrationDTO);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Roles(Role.ADMIN, Role.CUSTOMER)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('hello-protected')
  sayHello() {
    return 'Hello from auth controller';
  }
}
