import { z } from 'zod';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { XboostService } from '../services/xboost-service.js';
import { createPostTool } from './createPost.js';
import { schedulePostTool } from './schedulePost.js';
import { getAnalyticsTool } from './getAnalytics.js';
import { listScheduledTool } from './listScheduled.js';
import { repostBuzzTool } from './repostBuzz.js';

export function registerTools(server: Server, xboostService: XboostService) {
  // Register create_post tool
  server.setRequestHandler(createPostTool, async (request) => {
    const args = request.params.arguments as {
      text?: string;
      mediaUrls?: string[];
      replyTo?: string;
    };
    const { text, mediaUrls, replyTo } = args;

    try {
      // Get user ID from context (simplified for now)
      const userId = process.env.XBOOST_USER_ID || 'demo-user';

      if (!text) {
        throw new Error('Text is required');
      }

      const post = await xboostService.createPost({
        userId,
        content: text,
        mediaUrls,
        twitterAccountId: replyTo, // Using replyTo as account ID for now
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            postId: post.id,
            url: `https://twitter.com/i/status/${post.twitterPostId || post.id}`,
          }, null, 2),
        }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: errorMessage,
          }, null, 2),
        }],
        isError: true,
      };
    }
  });

  // Register schedule_post tool
  server.setRequestHandler(schedulePostTool, async (request) => {
    const args = request.params.arguments as {
      text?: string;
      scheduledAt?: string;
      mediaUrls?: string[];
      hashtags?: string[];
    };
    const { text, scheduledAt, mediaUrls, hashtags } = args;

    try {
      const userId = process.env.XBOOST_USER_ID || 'demo-user';

      if (!text) {
        throw new Error('Text is required');
      }

      if (!scheduledAt) {
        throw new Error('scheduledAt is required');
      }

      const content = hashtags && hashtags.length > 0
        ? `${text}\n\n${hashtags.map((h) => h.startsWith('#') ? h : `#${h}`).join(' ')}`
        : text;

      const post = await xboostService.schedulePost({
        userId,
        content,
        scheduledAt: new Date(scheduledAt),
        mediaUrls,
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            scheduledPostId: post.id,
            scheduledAt: post.scheduledAt,
          }, null, 2),
        }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: errorMessage,
          }, null, 2),
        }],
        isError: true,
      };
    }
  });

  // Register get_analytics tool
  server.setRequestHandler(getAnalyticsTool, async (request) => {
    const args = request.params.arguments as {
      period?: string;
      metrics?: Array<'impressions' | 'likes' | 'retweets' | 'replies' | 'engagementRate'>;
    };
    const { period = '30d', metrics } = args;

    try {
      const userId = process.env.XBOOST_USER_ID || 'demo-user';
      const analytics = await xboostService.getAnalytics({ userId, period });

      // Filter by metrics if provided
      let filteredPosts = analytics.posts;
      if (metrics && metrics.length > 0) {
        filteredPosts = analytics.posts.map((post) => {
          const filtered: Record<string, unknown> = {
            id: post.id,
            content: post.content,
            publishedAt: post.publishedAt,
          };
          if (metrics.includes('impressions')) filtered.impressions = post.impressions;
          if (metrics.includes('likes')) filtered.likes = post.likes;
          if (metrics.includes('retweets')) filtered.retweets = post.retweets;
          if (metrics.includes('replies')) filtered.replies = post.replies;
          if (metrics.includes('engagementRate')) {
            filtered.engagementRate = post.impressions > 0
              ? ((post.likes + post.retweets + post.replies) / post.impressions * 100).toFixed(2)
              : '0.00';
          }
          return filtered;
        });
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            ...analytics,
            posts: filteredPosts,
          }, null, 2),
        }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: errorMessage,
          }, null, 2),
        }],
        isError: true,
      };
    }
  });

  // Register list_scheduled tool
  server.setRequestHandler(listScheduledTool, async (request) => {
    const args = request.params.arguments as {
      status?: 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
      limit?: number;
      fromDate?: string;
      toDate?: string;
    };
    const { status, limit, fromDate, toDate } = args;

    try {
      const userId = process.env.XBOOST_USER_ID || 'demo-user';
      const posts = await xboostService.listScheduledPosts({
        userId,
        status,
        limit,
        fromDate: fromDate ? new Date(fromDate) : undefined,
        toDate: toDate ? new Date(toDate) : undefined,
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            posts,
            count: posts.length,
          }, null, 2),
        }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: errorMessage,
          }, null, 2),
        }],
        isError: true,
      };
    }
  });

  // Register repost_buzz tool
  server.setRequestHandler(repostBuzzTool, async (request) => {
    const args = request.params.arguments as {
      postId?: string;
      comment?: string;
    };
    const { postId, comment } = args;

    try {
      const userId = process.env.XBOOST_USER_ID || 'demo-user';

      if (!postId) {
        throw new Error('postId is required');
      }

      const repost = await xboostService.repostBuzz({
        userId,
        postId,
        comment,
      });

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            repostId: repost.id,
            originalPostId: postId,
          }, null, 2),
        }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: errorMessage,
          }, null, 2),
        }],
        isError: true,
      };
    }
  });
}

// Tool definitions for schema registration
export const createPostTool = {
  name: 'create_post',
  description: 'Create and publish a post to X (Twitter) immediately. Max 280 characters.',
  inputSchema: z.object({
    text: z.string().describe('Post content (max 280 characters)'),
    mediaUrls: z.array(z.string()).optional().describe('Array of media URLs to attach'),
    replyTo: z.string().optional().describe('Twitter account ID to post from'),
  }),
};

export const schedulePostTool = {
  name: 'schedule_post',
  description: 'Schedule a post for future automatic publication.',
  inputSchema: z.object({
    text: z.string().describe('Post content'),
    scheduledAt: z.string().describe('ISO 8601 datetime for scheduling (e.g., 2026-01-23T10:00:00Z)'),
    mediaUrls: z.array(z.string()).optional().describe('Array of media URLs to attach'),
    hashtags: z.array(z.string()).optional().describe('Array of hashtags (with or without #)'),
  }),
};

export const getAnalyticsTool = {
  name: 'get_analytics',
  description: 'Retrieve analytics data for specified period. Returns impressions, likes, retweets, replies, and engagement rate.',
  inputSchema: z.object({
    period: z.enum(['7d', '30d', '90d', '1y', 'all']).describe('Time period for analytics'),
    metrics: z.array(z.enum(['impressions', 'likes', 'retweets', 'replies', 'engagementRate'])).optional().describe('Specific metrics to retrieve (optional)'),
  }),
};

export const listScheduledTool = {
  name: 'list_scheduled',
  description: 'List scheduled posts with optional filtering by status and date range.',
  inputSchema: z.object({
    status: z.enum(['SCHEDULED', 'PUBLISHED', 'FAILED']).optional().describe('Filter by post status'),
    limit: z.number().min(1).max(100).optional().describe('Maximum number of results (default: 100)'),
    fromDate: z.string().optional().describe('ISO 8601 date for start of range'),
    toDate: z.string().optional().describe('ISO 8601 date for end of range'),
  }),
};

export const repostBuzzTool = {
  name: 'repost_buzz',
  description: 'Repost a high-performing post with optional comment (quote retweet).',
  inputSchema: z.object({
    postId: z.string().describe('ID of the post to repost'),
    comment: z.string().optional().describe('Optional comment to add when quoting'),
  }),
};

export { createPostTool, schedulePostTool, getAnalyticsTool, listScheduledTool, repostBuzzTool };
