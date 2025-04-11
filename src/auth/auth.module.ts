import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtAccessStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    PassportModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    { provide: APP_GUARD, useClass: JwtAuthGuard }, 
    LocalStrategy, 
    JwtAccessStrategy,
    JwtRefreshStrategy
  ]
})
export class AuthModule {}
