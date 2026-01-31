import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/automation/plug/history
 *
 * プラグ挿入履歴を取得
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const ruleId = searchParams.get('ruleId');

    const history = await prisma.plugHistory.findMany({
      where: {
        userId: session.user.id,
        ...(ruleId && { ruleId }),
      },
      include: {
        rule: {
          include: {
            template: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.plugHistory.count({
      where: {
        userId: session.user.id,
        ...(ruleId && { ruleId }),
      },
    });

    return NextResponse.json(
      {
        data: history,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching plug history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/automation/plug/history
 *
 * 手動でプラグ挿入履歴を記録（スケジューラー等から使用）
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { ruleId, originalPostId, insertedPostId, content, reason } = body;

    // バリデーション
    if (!ruleId) {
      return NextResponse.json(
        { error: 'Rule ID is required', code: 'INVALID_RULE_ID' },
        { status: 400 }
      );
    }

    if (!originalPostId) {
      return NextResponse.json(
        { error: 'Original post ID is required', code: 'INVALID_POST_ID' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required', code: 'INVALID_CONTENT' },
        { status: 400 }
      );
    }

    // ルールの所有権を確認
    const rule = await prisma.autoPlugRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule) {
      return NextResponse.json(
        { error: 'Rule not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    if (rule.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    const historyEntry = await prisma.plugHistory.create({
      data: {
        userId: session.user.id,
        ruleId,
        originalPostId,
        insertedPostId,
        content,
        reason,
      },
    });

    return NextResponse.json({ data: historyEntry }, { status: 201 });
  } catch (error) {
    console.error('Error creating plug history:', error);
    return NextResponse.json(
      { error: 'Failed to create history', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
