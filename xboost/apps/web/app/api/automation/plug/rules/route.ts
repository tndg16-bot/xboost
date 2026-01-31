import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/automation/plug/rules
 *
 * ユーザーの自動プラグルールを取得
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const rules = await prisma.autoPlugRule.findMany({
      where: { userId: session.user.id },
      include: {
        template: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: rules }, { status: 200 });
  } catch (error) {
    console.error('Error fetching auto-plug rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rules', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/automation/plug/rules
 *
 * 新しい自動プラグルールを作成、または既存のルールを更新
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
    const {
      id, // 既存のルールを更新する場合
      enabled = false,
      condition = 'ENGAGEMENT_THRESHOLD',
      metricType = 'impressions',
      threshold = 10000,
      hoursAfterPost = 1,
      useTemplate = true,
      templateId,
      customContent,
      insertAsReply = false,
    } = body;

    // バリデーション
    if (threshold < 0) {
      return NextResponse.json(
        { error: 'Threshold must be positive', code: 'INVALID_THRESHOLD' },
        { status: 400 }
      );
    }

    if (hoursAfterPost < 0) {
      return NextResponse.json(
        { error: 'Hours after post must be positive', code: 'INVALID_HOURS' },
        { status: 400 }
      );
    }

    if (useTemplate && !templateId && !customContent) {
      return NextResponse.json(
        { error: 'Either templateId or customContent is required when useTemplate is true',
          code: 'INVALID_CONTENT' },
        { status: 400 }
      );
    }

    // 更新か新規作成かを判定
    let rule;
    if (id) {
      // 既存ルールの更新
      const existingRule = await prisma.autoPlugRule.findUnique({
        where: { id },
      });

      if (!existingRule) {
        return NextResponse.json(
          { error: 'Rule not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      if (existingRule.userId !== session.user.id) {
        return NextResponse.json(
          { error: 'Unauthorized', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }

      rule = await prisma.autoPlugRule.update({
        where: { id },
        data: {
          enabled,
          condition,
          metricType,
          threshold,
          hoursAfterPost,
          useTemplate,
          templateId,
          customContent,
          insertAsReply,
        },
        include: { template: true },
      });
    } else {
      // 新規ルール作成
      rule = await prisma.autoPlugRule.create({
        data: {
          userId: session.user.id,
          enabled,
          condition,
          metricType,
          threshold,
          hoursAfterPost,
          useTemplate,
          templateId,
          customContent,
          insertAsReply,
        },
        include: { template: true },
      });
    }

    return NextResponse.json({ data: rule }, { status: 200 });
  } catch (error) {
    console.error('Error saving auto-plug rule:', error);
    return NextResponse.json(
      { error: 'Failed to save rule', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/automation/plug/rules
 *
 * 自動プラグルールを削除
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Rule ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const existingRule = await prisma.autoPlugRule.findUnique({
      where: { id },
    });

    if (!existingRule) {
      return NextResponse.json(
        { error: 'Rule not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    if (existingRule.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    await prisma.autoPlugRule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting auto-plug rule:', error);
    return NextResponse.json(
      { error: 'Failed to delete rule', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
