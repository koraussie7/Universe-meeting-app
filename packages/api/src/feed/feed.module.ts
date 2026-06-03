import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { MastodonService } from './mastodon.service';

@Module({
  controllers: [FeedController],
  providers: [FeedService, MastodonService],
  exports: [FeedService],
})
export class FeedModule {}
