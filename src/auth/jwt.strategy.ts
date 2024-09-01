import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        if (req.body && req.body.token) {
          console.log('JWT Token:', req.body.token); 
          return req.body.token; 
        }
        // If no token is found, throw an UnauthorizedException
        throw new UnauthorizedException('Token not found in request body');
      },
      secretOrKey: 'Hey buddy sit back and relax and enjoy the show', // Use the correct secret key
    });
  }
 
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
  
}
