import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  signToken(userId: number): { access_token: string } {
    return { access_token: this.jwt.sign({ sub: userId }) };
  }

  verifyToken(token: string) {
    try {
      return this.jwt.verify(token);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
