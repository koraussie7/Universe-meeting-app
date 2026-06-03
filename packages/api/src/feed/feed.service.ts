import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async createPost(authorId: number, data: { caption?: string; type?: string; mediaUrl?: string }) {
    return this.prisma.post.create({
      data: {
        authorId,
        caption: data.caption,
        type: data.type || 'photo',
        mediaUrl: data.mediaUrl,
      },
      include: { author: { select: { id: true, username: true, avatar: true } } },
    });
  }

  async getFeed(take = 20, skip = 0) {
    return this.prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: {
        author: { select: { id: true, username: true, avatar: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
  }

  async getReels(take = 10, skip = 0) {
    return this.prisma.post.findMany({
      where: { type: 'reel', isPublished: true },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });
  }

  async toggleLike(userId: number, postId: number) {
    const existing = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      await this.prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });
      return { liked: false };
    } else {
      await this.prisma.like.create({ data: { userId, postId } });
      await this.prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      });
      return { liked: true };
    }
  }

  async addComment(userId: number, postId: number, text: string) {
    const comment = await this.prisma.comment.create({
      data: { userId, postId, text },
      include: { user: { select: { id: true, username: true, avatar: true } } },
    });
    await this.prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });
    return comment;
  }

  async getPost(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatar: true, name: true } },
        comments: {
          include: { user: { select: { id: true, username: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: { select: { likes: true } },
      },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }
}
