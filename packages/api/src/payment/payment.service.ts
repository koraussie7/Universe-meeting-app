import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private paymentBaseUrl: string;

  constructor() {
    this.paymentBaseUrl = process.env.PAYMENT_API_URL || 'http://100.92.78.41:4000/api/v1';
  }

  async subscribe(creatorId: number, paymentMethodId: string, fanId: number, jwt: string) {
    try {
      const res = await fetch(this.paymentBaseUrl + '/payments/subscribe/' + creatorId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + jwt },
        body: JSON.stringify({ paymentMethodId }),
      });
      return await res.json();
    } catch (e: any) {
      this.logger.error('Payment proxy failed: ' + e.message);
      return { error: 'Payment service unavailable' };
    }
  }

  async tip(creatorId: number, amount: number, fanId: number, jwt: string) {
    try {
      const res = await fetch(this.paymentBaseUrl + '/payments/tip/' + creatorId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + jwt },
        body: JSON.stringify({ amount }),
      });
      return await res.json();
    } catch (e: any) {
      this.logger.error('Tip proxy failed: ' + e.message);
      return { error: 'Payment service unavailable' };
    }
  }

  async getSubscriptions(jwt: string) {
    try {
      const res = await fetch(this.paymentBaseUrl + '/payments/my-subscriptions', {
        headers: { Authorization: 'Bearer ' + jwt },
      });
      return await res.json();
    } catch (e: any) {
      return { error: 'Payment service unavailable' };
    }
  }

  async checkAccess(videoId: number, jwt: string) {
    try {
      const res = await fetch(this.paymentBaseUrl + '/payments/check-access/' + videoId, {
        headers: { Authorization: 'Bearer ' + jwt },
      });
      return await res.json();
    } catch (e: any) {
      return { error: 'Payment service unavailable' };
    }
  }
}
