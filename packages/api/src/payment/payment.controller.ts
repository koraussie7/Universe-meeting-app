import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private payment: PaymentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('subscribe/:creatorId')
  subscribe(@Param('creatorId') id: string, @Body('paymentMethodId') pmId: string, @Req() req) {
    const jwt = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.payment.subscribe(Number(id), pmId, req.user.id, jwt);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('tip/:creatorId')
  tip(@Param('creatorId') id: string, @Body('amount') amount: number, @Req() req) {
    const jwt = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.payment.tip(Number(id), amount, req.user.id, jwt);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-subscriptions')
  mySubscriptions(@Req() req) {
    const jwt = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.payment.getSubscriptions(jwt);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check-access/:videoId')
  checkAccess(@Param('videoId') id: string, @Req() req) {
    const jwt = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.payment.checkAccess(Number(id), jwt);
  }
}
