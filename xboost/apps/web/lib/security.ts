import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * Security Middleware for API Routes
 *
 * Features:
 * - CORS configuration
 * - Rate limiting
 * - Security headers
 */

// CORS configuration
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'https://*.vercel.app'];

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || '';

  // CORS headers
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // OPTIONS preflight request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

/**
 * API Route Security Wrapper
 *
 * Combines rate limiting with security checks
 */
export async function withSecurityHeaders(
  response: NextResponse,
  request?: NextRequest
): Promise<NextResponse> {
  // Rate limit info
  if (request) {
    const limitInfo = await checkRateLimit(request);
    response.headers.set('X-RateLimit-Limit', limitInfo.remaining.toString());
    response.headers.set('X-RateLimit-Reset', limitInfo.resetAt || '');
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

/**
 * Validate request origin (for sensitive operations)
 */
export function validateOrigin(request: NextRequest, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  return allowedOrigins.includes(origin);
}

/**
 * Validate API key format
 */
export function isValidApiKey(apiKey: string | null | undefined): boolean {
  // Basic validation: 32+ characters, alphanumeric + special chars
  if (!apiKey) return false;
  if (typeof apiKey !== 'string') return false;
  return apiKey.length >= 32 && /^[a-zA-Z0-9\-_]+/.test(apiKey);
}
