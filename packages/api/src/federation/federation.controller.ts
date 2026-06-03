import { Controller, Get, Post, Param, Body, Req, Res, Query } from '@nestjs/common';
import { FederationService } from './federation.service';

@Controller('federation')
export class FederationController {
  constructor(private fed: FederationService) {}

  @Get(':username')
  async getActor(@Param('username') username: string, @Req() req: any, @Res() res: any) {
    const accept = req.headers.accept || '';
    const actor = await this.fed.getActor(username);
    if (!actor) return res.status(404).json({ error: 'Not found' });

    if (accept.includes('application/activity+json') || accept.includes('application/ld+json')) {
      return res.type('application/activity+json').json(actor);
    }
    return res.json(actor);
  }

  @Post(':username/inbox')
  async inbox(@Param('username') username: string, @Body() activity: any) {
    return this.fed.handleInbox(username, activity);
  }

  @Get('webfinger')
  async webfinger(@Query('resource') resource: string, @Res() res: any) {
    const match = resource?.match(/acct:(.+)@(.+)/);
    if (match) {
      return res.json({
        subject: 'acct:' + match[1] + '@' + match[2],
        links: [{
          rel: 'self',
          type: 'application/activity+json',
          href: 'https://universe.privseai.com/api/v1/federation/' + match[1],
        }],
      });
    }
    return res.status(400).json({ error: 'Invalid resource' });
  }
}
