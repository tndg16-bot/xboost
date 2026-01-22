import { PrismaClient } from '@prisma/client';

export interface XboostServiceOptions {
  databaseUrl?: string;
}

export class XboostService {
  private prisma: PrismaClient;

  constructor(options: XboostServiceOptions = {}) {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: options.databaseUrl || process.env.DATABASE_URL,
        },
      },
    });
  }

  async createPost(params: {
    userId: string;
    content: string;
    mediaUrls?: string[];
    twitterAccountId?: string;
  }) {
    return this.prisma.post.create({
      data: {
        userId: params.userId,
        content: params.content,
        mediaUrls: params.mediaUrls || [],
        twitterAccountId: params.twitterAccountId,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }

  async schedulePost(params: {
    userId: string;
    content: string;
    scheduledAt: Date;
    mediaUrls?: string[];
    twitterAccountId?: string;
  }) {
    return this.prisma.scheduledPost.create({
      data: {
        userId: params.userId,
        content: params.content,
        scheduledAt: params.scheduledAt,
        mediaUrls: params.mediaUrls || [],
        twitterAccountId: params.twitterAccountId,
        status: 'SCHEDULED',
      },
    });
  }

  async getAnalytics(params: {
    userId: string;
    period: string;
  }) {
    const now = new Date();
    let startDate = new Date();

    switch (params.period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const posts = await this.prisma.post.findMany({
      where: {
        userId: params.userId,
        status: 'PUBLISHED',
        publishedAt: { gte: startDate },
      },
      select: {
        id: true,
        content: true,
        impressions: true,
        likes: true,
        retweets: true,
        replies: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    const totalImpressions = posts.reduce((sum, p) => sum + p.impressions, 0);
    const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
    const totalRetweets = posts.reduce((sum, p) => sum + p.retweets, 0);
    const totalReplies = posts.reduce((sum, p) => sum + p.replies, 0);
    const totalEngagements = totalLikes + totalRetweets + totalReplies;
    const engagementRate = totalImpressions > 0
      ? ((totalEngagements / totalImpressions) * 100).toFixed(2)
      : '0.00';

    return {
      posts,
      summary: {
        totalPosts: posts.length,
        totalImpressions,
        totalLikes,
        totalRetweets,
        totalReplies,
        engagementRate: parseFloat(engagementRate),
      },
    };
  }

  async listScheduledPosts(params: {
    userId: string;
    status?: 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
    limit?: number;
    fromDate?: Date;
    toDate?: Date;
  }) {
    const where: any = {
      userId: params.userId,
      ...(params.status && { status: params.status }),
      ...(params.fromDate || params.toDate && {
        scheduledAt: {
          ...(params.fromDate && { gte: params.fromDate }),
          ...(params.toDate && { lte: params.toDate }),
        },
      }),
    };

    return this.prisma.scheduledPost.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      take: params.limit || 100,
    });
  }

  async repostBuzz(params: {
    userId: string;
    postId: string;
    comment?: string;
  }) {
    // Find original post
    const originalPost = await this.prisma.post.findUnique({
      where: { id: params.postId },
    });

    if (!originalPost) {
      throw new Error('Post not found');
    }

    // Create repost
    const repostContent = params.comment
      ? `${params.comment}\n\nRT: ${originalPost.content.substring(0, 200)}`
      : `RT: ${originalPost.content.substring(0, 280)}`;

    return this.prisma.post.create({
      data: {
        userId: params.userId,
        content: repostContent,
        twitterAccountId: originalPost.twitterAccountId,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }

  async getPost(params: { postId: string; userId: string }) {
    return this.prisma.post.findFirst({
      where: {
        id: params.postId,
        userId: params.userId,
      },
    });
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}
