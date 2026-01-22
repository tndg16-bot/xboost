import { NextResponse } from 'next/server';

// OpenAPI 3.0 specification for Xboost Public API
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Xboost Public API',
    version: '1.0.0',
    description: 'Xboost API for managing Twitter posts, analytics, and automation',
    contact: {
      name: 'Xboost Team',
      url: 'https://xboost.now',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://api.xboost.now',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API key authentication',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          code: { type: 'string' },
        },
        required: ['error'],
      },
      Post: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          content: { type: 'string', maxLength: 280 },
          mediaUrls: { type: 'array', items: { type: 'string' } },
          twitterAccountId: { type: 'string' },
          status: {
            type: 'string',
            enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'DELETED'],
          },
          impressions: { type: 'integer' },
          likes: { type: 'integer' },
          retweets: { type: 'integer' },
          replies: { type: 'integer' },
          publishedAt: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Analytics: {
        type: 'object',
        properties: {
          period: { type: 'string' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          summary: {
            type: 'object',
            properties: {
              totalPosts: { type: 'integer' },
              totalImpressions: { type: 'integer' },
              totalLikes: { type: 'integer' },
              totalRetweets: { type: 'integer' },
              totalReplies: { type: 'integer' },
              engagementRate: { type: 'number' },
            },
          },
        },
      },
    },
  },
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
  paths: {
    '/api/v1/posts': {
      get: {
        summary: 'List posts',
        description: 'Retrieve a paginated list of posts',
        tags: ['Posts'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'DELETED'] },
            description: 'Filter by post status',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
            description: 'Number of results per page',
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', default: 0, minimum: 0 },
            description: 'Pagination offset',
          },
          {
            name: 'twitterAccountId',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by Twitter account ID',
          },
        ],
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    posts: { type: 'array', items: { $ref: '#/components/schemas/Post' } },
                    total: { type: 'integer' },
                    limit: { type: 'integer' },
                    offset: { type: 'integer' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create post',
        description: 'Create a new post',
        tags: ['Posts'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string', maxLength: 280 },
                  mediaUrls: { type: 'array', items: { type: 'string' } },
                  twitterAccountId: { type: 'string' },
                  status: {
                    type: 'string',
                    enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED'],
                    default: 'DRAFT',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Post created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    post: { $ref: '#/components/schemas/Post' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/v1/posts/{id}': {
      get: {
        summary: 'Get post',
        description: 'Retrieve a single post by ID',
        tags: ['Posts'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    post: { $ref: '#/components/schemas/Post' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      patch: {
        summary: 'Update post',
        description: 'Update an existing post',
        tags: ['Posts'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  content: { type: 'string', maxLength: 280 },
                  mediaUrls: { type: 'array', items: { type: 'string' } },
                  twitterAccountId: { type: 'string' },
                  status: {
                    type: 'string',
                    enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED'],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Post updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    post: { $ref: '#/components/schemas/Post' },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete post',
        description: 'Soft delete a post (set status to DELETED)',
        tags: ['Posts'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Post deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/analytics': {
      get: {
        summary: 'Get analytics',
        description: 'Retrieve analytics data for a specified period',
        tags: ['Analytics'],
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: 'period',
            in: 'query',
            schema: { type: 'string', enum: ['7d', '30d', '90d', '1y', 'all'], default: '30d' },
            description: 'Time period for analytics',
          },
        ],
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    analytics: { $ref: '#/components/schemas/Analytics' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/automation/repost': {
      post: {
        summary: 'Repost automation',
        description: 'Create a repost of an existing post (retweet or quote retweet)',
        tags: ['Automation'],
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['postId'],
                properties: {
                  postId: { type: 'string' },
                  comment: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Repost created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    repost: { $ref: '#/components/schemas/Post' },
                    originalPostId: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Posts',
      description: 'Post management endpoints',
    },
    {
      name: 'Analytics',
      description: 'Analytics and metrics endpoints',
    },
    {
      name: 'Automation',
      description: 'Automation and reposting endpoints',
    },
  ],
};

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Return JSON spec if asked
  if (url.pathname.endsWith('/openapi.json')) {
    return NextResponse.json(openApiSpec);
  }

  // Return HTML for Swagger UI
  return new Response(`
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4/swagger-ui.css">
  <title>Xboost API Documentation</title>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api/docs/openapi.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets Apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true
      });
    }
  </script>
</body>
</html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });
}
