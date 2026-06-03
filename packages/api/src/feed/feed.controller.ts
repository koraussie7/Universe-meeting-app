import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeedService } from './feed.service';
import { MastodonService } from './mastodon.service';

@Controller('feed')
export class FeedController {
  constructor(
    private feed: FeedService,
    private mastodon: MastodonService,
  ) {}

  @Get()
  getFeed(@Query('take') take?: string, @Query('skip') skip?: string) {
    return this.feed.getFeed(Number(take) || 20, Number(skip) || 0);
  }

  @Get('mastodon')
  getMastodonFeed(@Query('take') take?: string) {
    return this.mastodon.getFeed(Number(take) || 20);
  }

  @Get('reels')
  getReels(@Query('take') take?: string, @Query('skip') skip?: string) {
    return this.feed.getReels(Number(take) || 10, Number(skip) || 0);
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.feed.getPost(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createPost(
    @Body() body: { caption?: string; type?: string; mediaUrl?: string },
    @Req() req,
  ) {
    return this.feed.createPost(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  toggleLike(@Param('id') id: string, @Req() req) {
    return this.feed.toggleLike(req.user.id, Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comment')
  addComment(
    @Param('id') id: string,
    @Body('text') text: string,
    @Req() req,
  ) {
    return this.feed.addComment(req.user.id, Number(id), text);
  }
}
