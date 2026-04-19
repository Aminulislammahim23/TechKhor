import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtGuard } from './jwt/jwtGuard.guard';
import { RolesGuard } from './roles/roles.guard';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtGuard, RolesGuard],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'fizzy',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}

