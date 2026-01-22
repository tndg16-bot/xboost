import { NextResponse } from 'next/server';
import { withApiAuthAndRateLimit, addRateLimitHeaders, checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET(request: Request) {
  const authResponse = await withApiAuthAndRateLimit(request);
  if (authResponse) return authResponse;

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d';
  const limitInfo = await checkRateLimit(request);

  const user = await (await import('@/lib/api-auth')).authenticateApiKey(request);

  // Calculate date range based on period
  const now = new Date();
  let startDate = new Date();

  switch (period) {
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

  // Fetch analytics data
  const [posts, totalImpressions, totalLikes, totalRetweets, totalReplies] = await Promise.all([
    db.post.findMany({
      where: {
        userId: user!.id,
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
        twitterAccount: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    }),
    db.post.aggregate({
      where: {
        userId: user!.id,
        status: 'PUBLISHED',
        publishedAt: { gte: startDate },
      },
      _sum: { impressions: true },
    }),
    db.post.aggregate({
      where: {
        userId: user!.id,
        status: 'PUBLISHED',
        publishedAt: { gte: startDate },
      },
      _sum: { likes: true },
    }),
    db.post.aggregate({
      where: {
        userId: user!.id,
        status: 'PUBLISHED',
        publishedAt: { gte: startDate },
      },
      _sum: { retweets: true },
    }),
    db.post.aggregate({
      where: {
        userId: user!.id,
        status: 'PUBLISHED',
        publishedAt: { gte: startDate },
      },
      _sum: { replies: true },
    }),
  ]);

  // Calculate engagement rate
  const totalEngagements = (totalLikes._sum.likes || 0) +
                        (totalRetweets._sum.retweets || 0) +
                        (totalReplies._sum.replies || 0);
  const engagementRate = totalImpressions._sum.impressions > 0
    ? ((totalEngagements / totalImpressions._sum.impressions) * 100).toFixed(2)
    : '0.00';

  // Find top performing posts
  const topPosts = posts
    .sort((a: any, b: any) => b.impressions - a.impressions)
    .slice(0, 5);

  const analytics = {
    period,
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
    summary: {
      totalPosts: posts.length,
      totalImpressions: totalImpressions._sum.impressions || 0,
      totalLikes: totalLikes._sum.likes || 0,
      totalRetweets: totalRetweets._sum.retweets || 0,
      totalReplies: totalReplies._sum.replies || 0,
      engagementRate: parseFloat(engagementRate),
    },
    topPosts,
  };

  const response = NextResponse.json({ analytics });
  return addRateLimitHeaders(response, limitInfo);
}
