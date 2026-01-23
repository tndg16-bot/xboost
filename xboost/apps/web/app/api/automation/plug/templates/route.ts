import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/automation/plug/templates
 *
 * ユーザーのプラグテンプレート一覧を取得
 */
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const templates = await prisma.plugTemplate.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: templates }, { status: 200 });
  } catch (error) {
    console.error('Error fetching plug templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/automation/plug/templates
 *
 * 新しいプラグテンプレートを作成
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, content, isDefault = false } = body;

    // バリデーション
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required', code: 'INVALID_CONTENT' },
        { status: 400 }
      );
    }

    const template = await prisma.plugTemplate.create({
      data: {
        userId: session.user.id,
        name,
        content,
        isDefault,
      },
    });

    return NextResponse.json({ data: template }, { status: 201 });
  } catch (error) {
    console.error('Error creating plug template:', error);
    return NextResponse.json(
      { error: 'Failed to create template', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
