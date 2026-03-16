import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { publishPost } from '@/services/twitter-publisher';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/**
 * Cron Job: Process Scheduled Posts
 * Runs every 5 minutes via Vercel Cron
 * Publishes posts where scheduledAt <= now and status = 'SCHEDULED'
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for batch processing

const MAX_RETRIES = 3;

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
    processed: 0,
    published: 0,
    failed: 0,
    errors: [] as string[],
    timestamp: new Date().toISOString(),
  };

  try {
    // Find all scheduled posts that are due
    const duePosts = await db.scheduledPost.findMany({
      where: {
        scheduledAt: { lte: new Date() },
        status: 'SCHEDULED',
      },
      include: {
        twitterAccount: {
          select: {
            id: true,
            username: true,
            isActive: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 50, // Process max 50 per run to stay within timeout
    });

    result.processed = duePosts.length;

    for (const scheduledPost of duePosts) {
      // Skip if no active twitter account
      if (!scheduledPost.twitterAccountId || !scheduledPost.twitterAccount?.isActive) {
        await db.scheduledPost.update({
          where: { id: scheduledPost.id },
          data: {
            status: 'FAILED',
            errorMessage: 'No active Twitter account linked',
          },
        });
        result.failed++;
        result.errors.push(
          `Post ${scheduledPost.id}: No active Twitter account`
        );
        continue;
      }

      try {
        // Create a Post record from ScheduledPost
        const post = await db.post.create({
          data: {
            userId: scheduledPost.userId,
            twitterAccountId: scheduledPost.twitterAccountId,
            content: scheduledPost.content,
            mediaUrls: scheduledPost.mediaUrls,
            status: 'SCHEDULED',
          },
        });

        // Publish to Twitter
        const publishResult = await publishPost(
          post.id,
          scheduledPost.twitterAccountId
        );

        if (publishResult.success) {
          // Update scheduled post as published
          await db.scheduledPost.update({
            where: { id: scheduledPost.id },
            data: {
              status: 'PUBLISHED',
              publishedPostId: post.id,
            },
          });
          result.published++;
        } else {
          // Check retry count via error message history
          const retryCount = await getRetryCount(scheduledPost.id);

          if (retryCount < MAX_RETRIES) {
            // Keep as SCHEDULED for retry on next cron run
            await db.scheduledPost.update({
              where: { id: scheduledPost.id },
              data: {
                errorMessage: `Attempt ${retryCount + 1}/${MAX_RETRIES}: ${publishResult.error}`,
              },
            });
          } else {
            // Max retries exceeded - mark as FAILED
            await db.scheduledPost.update({
              where: { id: scheduledPost.id },
              data: {
                status: 'FAILED',
                errorMessage: `Max retries (${MAX_RETRIES}) exceeded. Last error: ${publishResult.error}`,
              },
            });
          }

          // Clean up the failed Post record
          await db.post.delete({ where: { id: post.id } }).catch(() => {});

          result.failed++;
          result.errors.push(
            `Post ${scheduledPost.id}: ${publishResult.error}`
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        await db.scheduledPost.update({
          where: { id: scheduledPost.id },
          data: {
            status: 'FAILED',
            errorMessage,
          },
        });
        result.failed++;
        result.errors.push(`Post ${scheduledPost.id}: ${errorMessage}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Scheduled posts processed',
      result,
    });
  } catch (error) {
    console.error('Cron job error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process scheduled posts',
      },
      { status: 500 }
    );
  }
}

/**
 * Count retry attempts by checking if errorMessage contains "Attempt X/Y"
 */
async function getRetryCount(scheduledPostId: string): Promise<number> {
  const post = await db.scheduledPost.findUnique({
    where: { id: scheduledPostId },
    select: { errorMessage: true },
  });

  if (!post?.errorMessage) return 0;

  const match = post.errorMessage.match(/Attempt (\d+)\//);
  return match ? parseInt(match[1], 10) : 0;
}
