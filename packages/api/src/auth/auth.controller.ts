import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('verify')
  verify(@Req() req) {
    return { user: req.user };
  }
}
