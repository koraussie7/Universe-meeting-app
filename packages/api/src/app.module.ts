import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LiveModule } from './live/live.module';
import { FeedModule } from './feed/feed.module';
import { MediaModule } from './media/media.module';
import { PaymentModule } from './payment/payment.module';
import { FederationModule } from './federation/federation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    LiveModule,
    FeedModule,
    MediaModule,
    PaymentModule,
    FederationModule,
  ],
})
export class AppModule {}
