import { NextResponse } from 'next/server';
import { prisma } from './prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export interface ApiKeyUser {
  id: string;
  name: string;
  email: string | null;
}

type ApiTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface RateLimitConfig {
  requests: number;
  windowMs: number;
}

export const RATE_LIMIT_CONFIGS: Record<ApiTier, RateLimitConfig> = {
  FREE: { requests: 100, windowMs: 60 * 60 * 1000 },      // 100 requests/hour
  PRO: { requests: 1000, windowMs: 60 * 60 * 1000 },    // 1000 requests/hour
  ENTERPRISE: { requests: 10000, windowMs: 60 * 60 * 1000 }, // 10000 requests/hour
};

/**
 * Authenticate request using API Key
 * @param request Next.js Request object
 * @returns User object if authenticated, null otherwise
 */
export async function authenticateApiKey(request: Request): Promise<ApiKeyUser | null> {
  const apiKey = request.headers.get('X-API-Key') || request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!apiKey) {
    return null;
  }

  try {
    const keyRecord = await db.apiKey.findUnique({
      where: { key: apiKey },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Check if key exists
    if (!keyRecord) {
      return null;
    }

    // Check if key is expired
    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
      return null;
    }

    // Update last used timestamp
    await db.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    return keyRecord.user as ApiKeyUser;
  } catch (error) {
    console.error('API key authentication error:', error);
    return null;
  }
}

/**
 * Require API authentication for a route
 * Returns 401 if not authenticated
 */
export function requireApiKey() {
  return async (request: Request): Promise<NextResponse | null> => {
    const user = await authenticateApiKey(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'INVALID_API_KEY' },
        { status: 401 }
      );
    }

    return null; // Continue to handler
  };
}

/**
 * Get API key tier for rate limiting
 */
export async function getApiKeyTier(request: Request): Promise<ApiTier | null> {
  const apiKey = request.headers.get('X-API-Key') || request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!apiKey) {
    return null;
  }

  try {
    const keyRecord = await db.apiKey.findUnique({
      where: { key: apiKey },
      select: { tier: true },
    });

    return keyRecord?.tier as ApiTier || 'FREE';
  } catch (error) {
    return null;
  }
}
