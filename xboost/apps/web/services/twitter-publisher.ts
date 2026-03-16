import { TwitterApi, SendTweetV2Params } from 'twitter-api-v2';
import { getValidClient } from '@/lib/twitter-client';
import {
  withRetry,
  checkPostingRateLimit,
  recordPostingAction,
} from '@/lib/twitter-rate-limiter';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export interface PublishResult {
  success: boolean;
  twitterPostId?: string;
  error?: string;
}

/**
 * Publish a single post to X/Twitter
 */
export async function publishPost(
  postId: string,
  twitterAccountId: string
): Promise<PublishResult> {
  try {
    const post = await db.post.findUnique({ where: { id: postId } });
    if (!post) {
      return { success: false, error: `Post not found: ${postId}` };
    }

    // Check per-user posting rate limit
    const rateCheck = checkPostingRateLimit(post.userId);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Posting rate limit exceeded. Resets at ${rateCheck.resetAt.toISOString()}`,
      };
    }

    const client = await getValidClient(twitterAccountId);

    // Build tweet params
    const params: SendTweetV2Params = { text: post.content };

    // Attach media if available
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      const mediaIds = await uploadMediaFromUrls(client, post.mediaUrls);
      if (mediaIds.length > 0) {
        // Twitter API requires 1-4 media IDs as a tuple type
        params.media = { media_ids: mediaIds.slice(0, 4) as [string] };
      }
    }

    // Publish with retry
    const result = await withRetry(() => client.v2.tweet(params));

    // Record rate limit action
    recordPostingAction(post.userId);

    // Update post in database
    await db.post.update({
      where: { id: postId },
      data: {
        twitterPostId: result.data.id,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    return { success: true, twitterPostId: result.data.id };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to publish post ${postId}:`, error);

    // Update post status to FAILED
    await db.post
      .update({
        where: { id: postId },
        data: { status: 'FAILED' },
      })
      .catch(() => {}); // Don't throw on status update failure

    return { success: false, error: errorMessage };
  }
}

/**
 * Publish a thread (multiple chained posts)
 */
export async function publishThread(
  postContents: string[],
  twitterAccountId: string,
  userId: string
): Promise<PublishResult> {
  try {
    const rateCheck = checkPostingRateLimit(userId);
    if (rateCheck.remaining < postContents.length) {
      return {
        success: false,
        error: `Not enough rate limit remaining (${rateCheck.remaining}) for thread of ${postContents.length} posts`,
      };
    }

    const client = await getValidClient(twitterAccountId);
    let previousTweetId: string | undefined;
    const tweetIds: string[] = [];

    for (const content of postContents) {
      const params: SendTweetV2Params = { text: content };
      if (previousTweetId) {
        params.reply = { in_reply_to_tweet_id: previousTweetId };
      }

      const result = await withRetry(() => client.v2.tweet(params));
      previousTweetId = result.data.id;
      tweetIds.push(result.data.id);
      recordPostingAction(userId);
    }

    return { success: true, twitterPostId: tweetIds[0] };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to publish thread:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Quote retweet a post
 */
export async function quoteRetweet(
  tweetId: string,
  comment: string,
  twitterAccountId: string,
  userId: string
): Promise<PublishResult> {
  try {
    const rateCheck = checkPostingRateLimit(userId);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Posting rate limit exceeded. Resets at ${rateCheck.resetAt.toISOString()}`,
      };
    }

    const client = await getValidClient(twitterAccountId);

    const result = await withRetry(() =>
      client.v2.tweet({ text: comment, quote_tweet_id: tweetId })
    );

    recordPostingAction(userId);

    return { success: true, twitterPostId: result.data.id };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to quote retweet:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Retweet a post
 */
export async function retweet(
  tweetId: string,
  twitterAccountId: string,
  userId: string
): Promise<PublishResult> {
  try {
    const client = await getValidClient(twitterAccountId);
    const account = await db.twitterAccount.findUnique({
      where: { id: twitterAccountId },
      select: { twitterId: true },
    });

    if (!account) {
      return { success: false, error: 'Twitter account not found' };
    }

    await withRetry(() => client.v2.retweet(account.twitterId, tweetId));
    recordPostingAction(userId);

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to retweet:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Upload media from URLs using Twitter v1.1 media upload
 */
async function uploadMediaFromUrls(
  client: TwitterApi,
  urls: string[]
): Promise<string[]> {
  const mediaIds: string[] = [];

  for (const url of urls) {
    try {
      // Fetch the media data
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to fetch media from ${url}: ${response.status}`);
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType =
        response.headers.get('content-type') || 'image/jpeg';

      // Upload to Twitter
      const mediaId = await withRetry(() =>
        client.v1.uploadMedia(buffer, { mimeType: contentType })
      );

      mediaIds.push(mediaId);
    } catch (error) {
      console.warn(`Failed to upload media from ${url}:`, error);
    }
  }

  return mediaIds;
}
