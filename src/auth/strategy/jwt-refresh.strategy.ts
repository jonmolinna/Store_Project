import { Injectable } from "@nestjs/common";
import {  PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_SECRET_REFRESH_TOKEN } from "src/config/constants";
import { Request } from 'express';

    @Injectable()
    export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
        constructor() {
            super({
                // jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
                jwtFromRequest: ExtractJwt.fromExtractors([
                    (req: Request) => req?.cookies?.refresh_token,
                ]),
                secretOrKey: JWT_SECRET_REFRESH_TOKEN,
                passReqToCallback: true
            })
        }

        validate(req: Request, payload: any) {
            return { id: payload.sub, username: payload.username }
        }
    }