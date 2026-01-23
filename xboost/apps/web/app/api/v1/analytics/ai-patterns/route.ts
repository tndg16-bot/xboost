import { NextResponse } from 'next/server';
import { withApiAuthAndRateLimit, addRateLimitHeaders, checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/**
 * POST /api/v1/analytics/ai-patterns
 * Analyze posts using AI for pattern discovery
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
      publishedAt: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 100, // Limit to 100 posts for AI analysis
  });

  if (posts.length === 0) {
    const response = NextResponse.json({
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      totalPosts: 0,
      error: 'No posts found for analysis',
    });

    return addRateLimitHeaders(response, limitInfo);
  }

  try {
    // Analyze posts for patterns using AI
    const { analyzeBatchForPatterns, generatePatternInsights } =
      await import('@/services/ai-pattern-analyzer');

    // Prepare posts for analysis
    const postsForAnalysis = posts.map((post: {
      content: string;
      likes: number;
      retweets: number;
      replies: number;
      quotes: number;
      id: string;
    }) => ({
      content: post.content,
      engagement:
        post.likes + post.retweets + post.replies + post.quotes,
      id: post.id,
    }));

    // Analyze for patterns
    const discoveredPatterns = await analyzeBatchForPatterns(postsForAnalysis);

    // Generate insights
    const insights = generatePatternInsights(discoveredPatterns);

    const response = NextResponse.json({
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      totalPosts: posts.length,
      analyzedPosts: postsForAnalysis.length,
      discoveredPatterns,
      insights,
    });

    return addRateLimitHeaders(response, limitInfo);
  } catch (error) {
    console.error('AI pattern analysis error:', error);

    const response = NextResponse.json(
      {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totalPosts: posts.length,
        error: error instanceof Error ? error.message : 'AI analysis failed',
      },
      { status: 500 }
    );

    return addRateLimitHeaders(response, limitInfo);
  }
}

/**
 * POST /api/v1/analytics/ai-patterns/analyze-post
 * Analyze a single post with AI
 */
export async function POST_SINGLE(request: Request) {
  const authResponse = await withApiAuthAndRateLimit(request);
  if (authResponse) return authResponse;

  const body = await request.json();
  const { postId } = body;
  const limitInfo = await checkRateLimit(request);

  const user = await (await import('@/lib/api-auth')).authenticateApiKey(request);

  // Fetch the post
  const post = await db.post.findUnique({
    where: { id: postId, userId: user!.id },
    select: {
      id: true,
      content: true,
      impressions: true,
      likes: true,
      retweets: true,
      replies: true,
      quotes: true,
    },
  });

  if (!post) {
    const response = NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
    return addRateLimitHeaders(response, limitInfo);
  }

  try {
    const { analyzePostWithAI } = await import('@/services/ai-pattern-analyzer');

    // Get historical metrics for context
    const historicalPosts = await db.post.findMany({
      where: {
        userId: user!.id,
        status: 'PUBLISHED',
        id: { not: postId },
      },
      select: {
        likes: true,
        retweets: true,
        replies: true,
        quotes: true,
      },
      take: 50,
    });

    const avgEngagement =
      historicalPosts.length > 0
        ? historicalPosts.reduce(
            (sum: number, p: { likes: number; retweets: number; replies: number; quotes: number }) =>
              sum + p.likes + p.retweets + p.replies + p.quotes,
            0
          ) / historicalPosts.length
        : 0;

    const topPerformingTopics: string[] = []; // Could be derived from existing analysis
    const bestFormats: string[] = []; // Could be derived from existing analysis

    // Analyze the post
    const analysis = await analyzePostWithAI(post.content, {
      avgEngagement,
      topPerformingTopics,
      bestFormats,
    });

    const response = NextResponse.json({
      postId,
      analysis,
    });

    return addRateLimitHeaders(response, limitInfo);
  } catch (error) {
    console.error('Single post AI analysis error:', error);

    const response = NextResponse.json(
      {
        postId,
        error: error instanceof Error ? error.message : 'AI analysis failed',
      },
      { status: 500 }
    );

    return addRateLimitHeaders(response, limitInfo);
  }
}
