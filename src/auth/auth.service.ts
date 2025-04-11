import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN } from 'src/config/constants';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.userService.findByUsername(username)

        if (user && await bcrypt.compare(password, user.password) && user.flag) {
            const {password, ...result} = user;
            return result
        }

        return null
    }

    async login(user: User): Promise<{access_token: string, refresh_token: string}> {
        const payload = { username: user.username, sub: user.id }

        const access_token = this.jwtService.sign(payload, {
            secret: JWT_SECRET_ACCESS_TOKEN,
            expiresIn: '15m'
        })

        const refresh_token = this.jwtService.sign(payload, {
            secret: JWT_SECRET_REFRESH_TOKEN,
            expiresIn: '1d'
        })

        return { access_token, refresh_token }
    }

    // async refreshTokens(user: User) {
    //     return this.login(user)
    // }
}
