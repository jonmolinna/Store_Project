import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorator/public.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { User } from 'src/users/entity/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      const user = req.user as User;
      const { access_token, refresh_token } =
        await this.authService.login(user);

      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: false, // true solo si usas HTTPS
        sameSite: 'lax', // production strict
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      return { access_token };
    } catch (error) {
      // if (error instanceof UnauthorizedException) {
      //   throw new CustomException(
      //     'Credenciales incorrectas',
      //     HttpStatus.FORBIDDEN,
      //   );
      // }

      // throw new CustomException(
      //   'Ocurrió un error',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      const user = req.user as User;
      const { access_token, refresh_token } =
        await this.authService.login(user);

      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        secure: false, // true solo si usas HTTPS
        sameSite: 'lax', // production strict
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { access_token };
    } catch (error) {
      // if (error instanceof UnauthorizedException) {
      //   throw new CustomException(
      //     'Credenciales incorrectas',
      //     HttpStatus.FORBIDDEN,
      //   );
      // }

      // throw new CustomException(
      //   'Ocurrió un error',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    console.log('TODO ------>');
    const response = req.logout();
    return response;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    try {
      const id = req.user.id as number;
      const user = await this.userService.findById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        id: user.id,
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        roles: user.roles,
      };


    } catch (error) {
      // throw new CustomException(
      //   'Ocurrió un error',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }
}
