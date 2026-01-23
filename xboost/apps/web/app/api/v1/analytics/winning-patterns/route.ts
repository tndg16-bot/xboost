import { NextResponse } from 'next/server';
import { withApiAuthAndRateLimit, addRateLimitHeaders, checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/**
 * POST /api/v1/analytics/winning-patterns
 * 勝ちパターン分析を実行
 */
export async function POST(request: Request) {
  const authResponse = await withApiAuthAndRateLimit(request);
  if (authResponse) return authResponse;

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d';
  const limitInfo = await checkRateLimit(request);

  const user = await (await import('@/lib/api-auth')).authenticateApiKey(request);

  // Calculate date range based on period
  const now = new Date();
  const startDate = new Date();

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

  // Fetch posts
  const posts = await db.post.findMany({
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
      quotes: true,
      format: true,
      contentType: true,
      isViral: true,
      viralThreshold: true,
      engagementRate: true,
      hook: true,
      contentLength: true,
      characterCount: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: 'desc' },
  });

  // Analyze winning patterns (import the analyzer function)
  const { analyzeWinningPatterns } = await import('@/services/winning-pattern-analyzer');

  const analysis = analyzeWinningPatterns(posts);

  const response = NextResponse.json({
    period,
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
    totalPosts: posts.length,
    analysis,
  });

  return addRateLimitHeaders(response, limitInfo);
}
