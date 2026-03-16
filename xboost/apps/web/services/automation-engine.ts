import { prisma } from '@/lib/prisma';
import { getValidClient } from '@/lib/twitter-client';
import {
  withRetry,
  checkPostingRateLimit,
  recordPostingAction,
} from '@/lib/twitter-rate-limiter';
import { quoteRetweet, retweet } from './twitter-publisher';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

interface AutomationResult {
  repostsProcessed: number;
  repostsExecuted: number;
  plugsProcessed: number;
  plugsExecuted: number;
  errors: string[];
}

/**
 * Main automation engine - evaluates all enabled rules and executes actions
 * Called by /api/cron/automation-engine every 15 minutes
 */
export async function runAutomationEngine(): Promise<AutomationResult> {
  const result: AutomationResult = {
    repostsProcessed: 0,
    repostsExecuted: 0,
    plugsProcessed: 0,
    plugsExecuted: 0,
    errors: [],
  };

  // Run both automation types
  await processAutoRepostRules(result);
  await processAutoPlugRules(result);

  return result;
}

/**
 * Process auto-repost rules
 * Finds published posts that match rule conditions and haven't been reposted yet
 */
async function processAutoRepostRules(
  result: AutomationResult
): Promise<void> {
  const rules = await db.autoRepostRule.findMany({
    where: { enabled: true },
    include: { user: { select: { id: true, activeAccountId: true } } },
  });

  for (const rule of rules) {
    try {
      result.repostsProcessed++;

      // Get user's active twitter account
      const twitterAccount = await db.twitterAccount.findFirst({
        where: {
          userId: rule.userId,
          isActive: true,
          ...(rule.user.activeAccountId
            ? { id: rule.user.activeAccountId }
            : {}),
        },
      });

      if (!twitterAccount) continue;

      // Check rate limit
      const rateCheck = checkPostingRateLimit(rule.userId);
      if (!rateCheck.allowed) continue;

      // Find published posts that meet the rule conditions
      const conditionFilter = buildConditionFilter(
        rule.condition,
        rule.threshold
      );

      // Get posts that haven't been reposted by this rule
      const repostedPostIds = await db.autoRepostHistory.findMany({
        where: { ruleId: rule.id },
        select: { postId: true },
      });
      const excludeIds = repostedPostIds.map(
        (h: { postId: string }) => h.postId
      );

      // Find eligible posts (published, with twitterPostId, meeting threshold, after delay)
      const delayDate = new Date(
        Date.now() - rule.delayHours * 60 * 60 * 1000
      );

      const eligiblePosts = await db.post.findMany({
        where: {
          userId: rule.userId,
          twitterAccountId: twitterAccount.id,
          status: 'PUBLISHED',
          twitterPostId: { not: null },
          publishedAt: { lte: delayDate },
          id: { notIn: excludeIds },
          ...conditionFilter,
        },
        orderBy: { impressions: 'desc' },
        take: rule.maxReposts,
      });

      for (const post of eligiblePosts) {
        try {
          // Check daily repost limit
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);

          const todayRepostCount = await db.autoRepostHistory.count({
            where: {
              userId: rule.userId,
              ruleId: rule.id,
              createdAt: { gte: todayStart },
            },
          });

          if (todayRepostCount >= rule.maxReposts) break;

          // Execute repost via Twitter API
          let repostResult;
          if (rule.addComment && rule.comment) {
            repostResult = await quoteRetweet(
              post.twitterPostId!,
              rule.comment,
              twitterAccount.id,
              rule.userId
            );
          } else {
            repostResult = await retweet(
              post.twitterPostId!,
              twitterAccount.id,
              rule.userId
            );
          }

          if (repostResult.success) {
            // Record in history
            await db.autoRepostHistory.create({
              data: {
                userId: rule.userId,
                ruleId: rule.id,
                postId: post.id,
                repostedPostId: repostResult.twitterPostId || post.twitterPostId,
                reason: `Auto-repost: ${rule.condition} >= ${rule.threshold} (actual: ${getMetricValue(post, rule.condition)})`,
              },
            });
            result.repostsExecuted++;
          } else {
            result.errors.push(
              `Repost failed for post ${post.id}: ${repostResult.error}`
            );
          }
        } catch (error) {
          const msg =
            error instanceof Error ? error.message : 'Unknown error';
          result.errors.push(`Repost error for post ${post.id}: ${msg}`);
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`Rule ${rule.id} error: ${msg}`);
    }
  }
}

/**
 * Process auto-plug rules
 * Finds high-engagement posts and adds promotional replies
 */
async function processAutoPlugRules(result: AutomationResult): Promise<void> {
  const rules = await db.autoPlugRule.findMany({
    where: { enabled: true },
    include: {
      template: true,
      user: { select: { id: true, activeAccountId: true } },
    },
  });

  for (const rule of rules) {
    try {
      result.plugsProcessed++;

      const twitterAccount = await db.twitterAccount.findFirst({
        where: {
          userId: rule.userId,
          isActive: true,
          ...(rule.user.activeAccountId
            ? { id: rule.user.activeAccountId }
            : {}),
        },
      });

      if (!twitterAccount) continue;

      const rateCheck = checkPostingRateLimit(rule.userId);
      if (!rateCheck.allowed) continue;

      // Find posts that exceed the threshold and are old enough
      const hoursAgoDate = new Date(
        Date.now() - rule.hoursAfterPost * 60 * 60 * 1000
      );

      // Get already-plugged post IDs
      const pluggedPostIds = await db.plugHistory.findMany({
        where: { ruleId: rule.id },
        select: { originalPostId: true },
      });
      const excludeIds = pluggedPostIds.map(
        (h: { originalPostId: string }) => h.originalPostId
      );

      // Build metric filter
      const metricFilter: Record<string, unknown> = {};
      metricFilter[rule.metricType] = { gte: rule.threshold };

      const eligiblePosts = await db.post.findMany({
        where: {
          userId: rule.userId,
          twitterAccountId: twitterAccount.id,
          status: 'PUBLISHED',
          twitterPostId: { not: null },
          publishedAt: { lte: hoursAgoDate },
          id: { notIn: excludeIds },
          ...metricFilter,
        },
        orderBy: { [rule.metricType]: 'desc' },
        take: rule.maxPlugs,
      });

      for (const post of eligiblePosts) {
        try {
          // Check daily plug limit
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);

          const todayPlugCount = await db.plugHistory.count({
            where: {
              userId: rule.userId,
              ruleId: rule.id,
              createdAt: { gte: todayStart },
            },
          });

          if (todayPlugCount >= rule.maxPlugs) break;

          // Determine plug content
          const plugContent =
            rule.useTemplate && rule.template
              ? rule.template.content
              : rule.customContent || '';

          if (!plugContent) continue;

          // Post as reply to the original tweet
          const client = await getValidClient(twitterAccount.id);

          const replyResult = await withRetry(() =>
            client.v2.tweet({
              text: plugContent,
              reply: { in_reply_to_tweet_id: post.twitterPostId! },
            })
          );

          recordPostingAction(rule.userId);

          // Record in history
          await db.plugHistory.create({
            data: {
              userId: rule.userId,
              ruleId: rule.id,
              originalPostId: post.id,
              insertedPostId: replyResult.data.id,
              content: plugContent,
              reason: `Auto-plug: ${rule.metricType} >= ${rule.threshold} (actual: ${post[rule.metricType]})`,
            },
          });

          result.plugsExecuted++;
        } catch (error) {
          const msg =
            error instanceof Error ? error.message : 'Unknown error';
          result.errors.push(`Plug error for post ${post.id}: ${msg}`);
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`Plug rule ${rule.id} error: ${msg}`);
    }
  }
}

/**
 * Build Prisma where clause for auto-repost condition
 */
function buildConditionFilter(
  condition: string,
  threshold: number
): Record<string, unknown> {
  switch (condition) {
    case 'IMPRESSIONS':
      return { impressions: { gte: threshold } };
    case 'LIKES':
      return { likes: { gte: threshold } };
    case 'RETWEETS':
      return { retweets: { gte: threshold } };
    case 'ENGAGEMENT_RATE':
      return { engagementRate: { gte: threshold } };
    default:
      return { impressions: { gte: threshold } };
  }
}

function getMetricValue(
  post: Record<string, unknown>,
  condition: string
): number {
  switch (condition) {
    case 'IMPRESSIONS':
      return (post.impressions as number) || 0;
    case 'LIKES':
      return (post.likes as number) || 0;
    case 'RETWEETS':
      return (post.retweets as number) || 0;
    case 'ENGAGEMENT_RATE':
      return (post.engagementRate as number) || 0;
    default:
      return 0;
  }
}
