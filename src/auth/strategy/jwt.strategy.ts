import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_SECRET_ACCESS_TOKEN } from "src/config/constants";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET_ACCESS_TOKEN
        })
    }

    validate(payload: any) {
        // payload is the decoded JWT token
        // It contains the data that was signed in the token
        return { id: payload.sub, username: payload.username, roles: payload.roles }
    }
}