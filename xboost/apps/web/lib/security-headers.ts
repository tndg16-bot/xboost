import { NextRequest, NextResponse } from 'next/server';

/**
 * Security Headers Middleware
 * Sprint 4: Security Hardening (Issue #132 - S4-4)
 */

export function securityHeadersMiddleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://accounts.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.twitter.com https://pbs.twimg.com https://abs.twimg.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.twitter.com https://api.openai.com https://api.stripe.com;
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Security Headers
  const securityHeaders = {
    'Content-Security-Policy': cspHeader,
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'X-DNS-Prefetch-Control': 'on',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none',
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * CORS Middleware Configuration
 */
export function corsMiddleware(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin') || '';
  
  // Allowed origins
  const allowedOrigins = [
    'http://localhost:3000',
    'https://www.xboost.now',
    'https://xboost.vercel.app',
    'https://*.vercel.app',
  ];

  // Check if origin is allowed
  const isAllowed = allowedOrigins.some(allowed => {
    if (allowed.includes('*')) {
      const regex = new RegExp(allowed.replace('*', '.*'));
      return regex.test(origin);
    }
    return allowed === origin;
  });

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    
    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }

  // Handle actual requests
  if (isAllowed) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  return null;
}

/**
 * Combined security middleware
 */
export function securityMiddleware(request: NextRequest): NextResponse {
  // Apply CORS first
  const corsResponse = corsMiddleware(request);
  if (corsResponse && corsResponse.status === 204) {
    return corsResponse; // Return preflight response
  }

  // Apply security headers
  const response = securityHeadersMiddleware(request);
  
  // Merge CORS headers if present
  if (corsResponse) {
    corsResponse.headers.forEach((value, key) => {
      if (key.startsWith('Access-Control')) {
        response.headers.set(key, value);
      }
    });
  }

  return response;
}
