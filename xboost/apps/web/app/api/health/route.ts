import { NextResponse } from 'next/server';

/**
 * Health Check API
 * Sprint 4: Monitoring & Uptime Check (Issue #132 - S4-3)
 */

export const dynamic = 'force-dynamic';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    api: boolean;
    database?: boolean;
    twitter?: boolean;
    openai?: boolean;
    stripe?: boolean;
  };
  uptime: number;
  environment: string;
}

let startTime = Date.now();

export async function GET() {
  const checks: HealthStatus['checks'] = {
    api: true,
  };

  // Check external services availability
  if (process.env.DATABASE_URL) checks.database = true;
  if (process.env.AUTH_TWITTER_ID) checks.twitter = true;
  if (process.env.OPENAI_API_KEY) checks.openai = true;
  if (process.env.STRIPE_SECRET_KEY) checks.stripe = true;

  const allChecks = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;

  let status: HealthStatus['status'] = 'healthy';
  if (allChecks === 0 && totalChecks > 1) status = 'unhealthy';
  else if (allChecks < totalChecks) status = 'degraded';

  const health: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
    checks,
    uptime: Date.now() - startTime,
    environment: process.env.VERCEL_ENV || 'development',
  };

  return NextResponse.json(health, {
    status: status === 'unhealthy' ? 503 : 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
