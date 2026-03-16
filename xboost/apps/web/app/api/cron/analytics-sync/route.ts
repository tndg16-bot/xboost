import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getValidClient } from '@/lib/twitter-client';
import { withRetry } from '@/lib/twitter-rate-limiter';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/**
 * Cron Job: Sync Analytics Data from Twitter API
 * Runs every 6 hours via Vercel Cron
 * Fetches public_metrics and non_public_metrics for published posts
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

function verifyCronRequest(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return process.env.NODE_ENV === 'development';
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!verifyCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = {
    accountsProcessed: 0,
    postsUpdated: 0,
    errors: [] as string[],
    timestamp: new Date().toISOString(),
  };

  try {
    // Get all active Twitter accounts
    const accounts = await db.twitterAccount.findMany({
      where: { isActive: true },
      select: {
        id: true,
        username: true,
        twitterId: true,
        userId: true,
      },
    });

    for (const account of accounts) {
      try {
        const client = await getValidClient(account.id);

        // Get published posts with twitterPostId for this account
        const posts = await db.post.findMany({
          where: {
            twitterAccountId: account.id,
            status: 'PUBLISHED',
            twitterPostId: { not: null },
          },
          select: {
            id: true,
            twitterPostId: true,
            publishedAt: true,
            impressions24h: true,
            metrics24hAt: true,
            impressions3d: true,
            metrics3dAt: true,
          },
          orderBy: { publishedAt: 'desc' },
          take: 100, // Sync most recent 100 posts per account
        });

        if (posts.length === 0) {
          result.accountsProcessed++;
          continue;
        }

        // Batch fetch metrics (Twitter API allows up to 100 IDs per request)
        const tweetIds = posts
          .map((p: { twitterPostId: string | null }) => p.twitterPostId)
          .filter(Boolean) as string[];

        // Process in batches of 100
        for (let i = 0; i < tweetIds.length; i += 100) {
          const batch = tweetIds.slice(i, i + 100);

          const tweetsResponse = await withRetry(() =>
            client.v2.tweets(batch, {
              'tweet.fields': [
                'public_metrics',
                'non_public_metrics',
                'organic_metrics',
              ],
            })
          );

          if (!tweetsResponse.data) continue;

          for (const tweet of tweetsResponse.data) {
            const post = posts.find(
              (p: { twitterPostId: string | null }) =>
                p.twitterPostId === tweet.id
            );
            if (!post || !tweet.public_metrics) continue;

            const metrics = tweet.public_metrics;
            const now = new Date();

            // Build update data
            const updateData: Record<string, unknown> = {
              impressions: metrics.impression_count || 0,
              likes: metrics.like_count || 0,
              retweets: metrics.retweet_count || 0,
              replies: metrics.reply_count || 0,
              quotes: metrics.quote_count || 0,
            };

            // Calculate engagement rate
            const totalEngagements =
              (metrics.like_count || 0) +
              (metrics.retweet_count || 0) +
              (metrics.reply_count || 0) +
              (metrics.quote_count || 0);
            if (metrics.impression_count && metrics.impression_count > 0) {
              updateData.engagementRate =
                (totalEngagements / metrics.impression_count) * 100;
            }

            // Check if post is viral
            const viralThreshold = (post as { viralThreshold?: number }).viralThreshold ?? 100000;
            updateData.isViral = (metrics.impression_count || 0) >= viralThreshold;

            // Snapshot 24h metrics (if post is ~24h old and not yet snapshotted)
            if (post.publishedAt) {
              const hoursOld =
                (now.getTime() - new Date(post.publishedAt).getTime()) /
                (1000 * 60 * 60);

              if (hoursOld >= 23 && hoursOld <= 36 && !post.metrics24hAt) {
                updateData.impressions24h = metrics.impression_count || 0;
                updateData.likes24h = metrics.like_count || 0;
                updateData.retweets24h = metrics.retweet_count || 0;
                updateData.replies24h = metrics.reply_count || 0;
                updateData.metrics24hAt = now;
              }

              if (hoursOld >= 71 && hoursOld <= 84 && !post.metrics3dAt) {
                updateData.impressions3d = metrics.impression_count || 0;
                updateData.likes3d = metrics.like_count || 0;
                updateData.retweets3d = metrics.retweet_count || 0;
                updateData.replies3d = metrics.reply_count || 0;
                updateData.metrics3dAt = now;
              }
            }

            await db.post.update({
              where: { id: post.id },
              data: updateData,
            });

            result.postsUpdated++;
          }
        }

        result.accountsProcessed++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        console.error(
          `Analytics sync failed for account ${account.username}:`,
          error
        );
        result.errors.push(`${account.username}: ${errorMessage}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Analytics sync completed',
      result,
    });
  } catch (error) {
    console.error('Analytics sync error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync analytics',
      },
      { status: 500 }
    );
  }
}
