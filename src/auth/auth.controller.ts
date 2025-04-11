import { Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException, Request, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomException } from 'src/exceptions/custom.exception';
import { Public } from 'src/decorator/public.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { User } from 'src/users/entity/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async signIn(@Req() req) {
        try {
            const user = req.user as User
            return await this.authService.login(user)

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw new CustomException('Credenciales incorrectas', HttpStatus.FORBIDDEN)
            }

            throw new CustomException("Ocurrió un error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
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

    @UseGuards(LocalAuthGuard)
    @Post('logout')
    async logout(@Request() req) {
        const response =  req.logout();
        return response
    }
}
