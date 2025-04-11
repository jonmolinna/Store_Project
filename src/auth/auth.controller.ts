import { Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException, Request, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomException } from 'src/exceptions/custom.exception';
import { Public } from 'src/decorator/public.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { User } from 'src/users/entity/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async signIn(@Req() req, @Res({passthrough: true}) res: Response) {
        try {
            const user = req.user as User
            const { access_token, refresh_token } = await this.authService.login(user);
            
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000 // 1d
            })
            

            return { access_token }

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw new CustomException('Credenciales incorrectas', HttpStatus.FORBIDDEN)
            }

            throw new CustomException("Ocurrió un error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    async refresh(@Req() req, @Res({passthrough: true}) res: Response) {
        try {
            const user = req.user as User
            const { access_token, refresh_token } = await this.authService.login(user);

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })

            return { access_token }
            
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw new CustomException('Credenciales incorrectas', HttpStatus.FORBIDDEN)
            }

            throw new CustomException("Ocurrió un error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @UseGuards(LocalAuthGuard)
    @Post('logout')
    async logout(@Request() req) {
        const response =  req.logout();
        return response
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        try {
            console.log("-------------> ", req.user)
            return 'Request'

        } catch (error) {
            throw new CustomException("Ocurrió un error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
