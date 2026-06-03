import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface MastodonStatus {
  id: string;
  content: string;
  created_at: string;
  account: {
    id: string;
    username: string;
    display_name: string;
    avatar: string;
  };
  media_attachments: Array<{
    id: string;
    url: string;
    preview_url: string;
    type: string;
  }>;
  favourites_count: number;
  replies_count: number;
  reblogs_count: number;
  tags: Array<{ name: string }>;
}

export interface FeedItem {
  id: string;
  content: string;
  plainText: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  media: Array<{ url: string; previewUrl: string; type: string }>;
  likes: number;
  replies: number;
  tags: string[];
}

@Injectable()
export class MastodonService {
  private readonly logger = new Logger(MastodonService.name);
  private readonly mastodonUrl: string;
  private cache: FeedItem[] = [];
  private lastFetch = 0;

  constructor(private config: ConfigService) {
    this.mastodonUrl = this.config.get<string>('MASTODON_URL', 'http://127.0.0.1:3000');
    this.logger.log(`Mastodon service: ${this.mastodonUrl}`);
  }

  /**
   * Fetch public timeline from Mastodon
   */
  async fetchPublicTimeline(limit = 40): Promise<FeedItem[]> {
    try {
      const { data } = await axios.get<MastodonStatus[]>(
        `${this.mastodonUrl}/api/v1/timelines/public`,
        {
          params: { limit, local: false },
          timeout: 15000,
        },
      );

      const feed = data.map(this.mapStatus);
      this.cache = feed;
      this.lastFetch = Date.now();
      this.logger.log(`Fetched ${feed.length} mastodon posts`);
      return feed;
    } catch (err) {
      this.logger.warn(`Mastodon fetch failed: ${err}`);
      // Return stale cache if available
      return this.cache;
    }
  }

  /**
   * Get feed — use cache if fresh (< 5 min)
   */
  async getFeed(limit = 20): Promise<FeedItem[]> {
    const cacheAge = Date.now() - this.lastFetch;
    if (cacheAge > 300_000 || this.cache.length === 0) {
      return this.fetchPublicTimeline(limit);
    }
    this.logger.debug(`Using cache (${(cacheAge / 1000).toFixed(0)}s old)`);
    return this.cache.slice(0, limit);
  }

  private mapStatus(s: MastodonStatus): FeedItem {
    return {
      id: s.id,
      content: s.content,
      plainText: this.stripHtml(s.content),
      createdAt: s.created_at,
      author: {
        id: s.account.id,
        username: s.account.username,
        displayName: s.account.display_name || s.account.username,
        avatar: s.account.avatar,
      },
      media: (s.media_attachments || []).map(m => ({
        url: m.url,
        previewUrl: m.preview_url,
        type: m.type,
      })),
      likes: s.favourites_count,
      replies: s.replies_count,
      tags: (s.tags || []).map(t => t.name),
    };
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }
}
