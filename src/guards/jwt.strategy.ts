import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });

    if (!configService.get<string>('JWT_SECRET')) {
      throw new UnauthorizedException('JWT_SECRET is not configured');
    }
  }

  // Validates JWT payload and returns the validated user
  async validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
