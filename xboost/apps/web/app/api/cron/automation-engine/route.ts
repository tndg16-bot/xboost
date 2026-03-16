import { NextResponse } from 'next/server';
import { runAutomationEngine } from '@/services/automation-engine';

/**
 * Cron Job: Automation Engine
 * Runs every 15 minutes via Vercel Cron
 * Processes auto-repost rules and auto-plug rules
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

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

  try {
    const result = await runAutomationEngine();

    return NextResponse.json({
      success: true,
      message: 'Automation engine completed',
      result,
    });
  } catch (error) {
    console.error('Automation engine error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Automation engine failed',
      },
      { status: 500 }
    );
  }
}
