import { z } from 'zod';
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { XboostService } from '../services/xboost-service.js';

export function registerResources(server: Server, xboostService: XboostService) {
  // Register post-history resource
  server.setRequestHandler({
    name: 'xboost_post_history',
    description: 'Post History - Complete historical data of tweets',
    uri: 'xboost://posts/{id}',
  }, async (request) => {
    const { id } = request.params.arguments as any;

    try {
      const userId = process.env.XBOOST_USER_ID || 'demo-user';
      const post = await xboostService.getPost({ postId: id, userId });

      if (!post) {
        return {
          contents: [{
            uri: `xboost://posts/${id}`,
            mimeType: 'application/json',
            text: JSON.stringify({
              error: 'Post not found',
            }, null, 2),
          }],
        };
      }

      return {
        contents: [{
          uri: `xboost://posts/${id}`,
          mimeType: 'application/json',
          text: JSON.stringify({
            id: post.id,
            content: post.content,
            status: post.status,
            impressions: post.impressions,
            likes: post.likes,
            retweets: post.retweets,
            replies: post.replies,
            publishedAt: post.publishedAt,
            createdAt: post.createdAt,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        contents: [{
          uri: `xboost://posts/${id}`,
          mimeType: 'application/json',
          text: JSON.stringify({
            error: error.message,
          }, null, 2),
        }],
        isError: true,
      };
    }
  });

  // Register analytics-data resource
  server.setRequestHandler({
    name: 'xboost_analytics_data',
    description: 'Analytics - Aggregate performance metrics across all posts',
    uri: 'xboost://analytics/{period}',
  }, async (request) => {
    const { period } = request.params.arguments as any;

    try {
      const userId = process.env.XBOOST_USER_ID || 'demo-user';
      const analytics = await xboostService.getAnalytics({ userId, period });

      // Find top performing posts
      const topPosts = analytics.posts
        .slice()
        .sort((a: any, b: any) => b.impressions - a.impressions)
        .slice(0, 10);

      return {
        contents: [{
          uri: `xboost://analytics/${period}`,
          mimeType: 'application/json',
          text: JSON.stringify({
            period,
            summary: analytics.summary,
            topPosts,
            totalPosts: analytics.posts.length,
          }, null, 2),
        }],
      };
    } catch (error: any) {
      return {
        contents: [{
          uri: `xboost://analytics/${period}`,
          mimeType: 'application/json',
          text: JSON.stringify({
            error: error.message,
          }, null, 2),
        }],
        isError: true,
      };
    }
  });
}

export const postHistoryResource = {
  name: 'xboost_post_history',
  description: 'Post History - Complete historical data of tweets',
  uri: 'xboost://posts/{id}',
  mimeType: 'application/json',
  annotations: {
    audience: ['user', 'assistant'],
    priority: 0.7,
  },
};

export const analyticsDataResource = {
  name: 'xboost_analytics_data',
  description: 'Analytics - Aggregate performance metrics across all posts',
  uri: 'xboost://analytics/{period}',
  mimeType: 'application/json',
  annotations: {
    audience: ['assistant'],
    priority: 0.9,
  },
};

export { postHistoryResource, analyticsDataResource };
