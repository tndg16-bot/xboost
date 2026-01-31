import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const validateCouponSchema = z.object({
  code: z.string().min(1, 'クーポンコードを入力してください'),
});

// POST /api/coupon/validate - クーポンコードを検証
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code } = validateCouponSchema.parse(body);

    // クーポンを検索
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: '無効なクーポンコードです', valid: false },
        { status: 400 }
      );
    }

    // 有効期限チェック
    const now = new Date();
    if (coupon.validFrom && coupon.validFrom > now) {
      return NextResponse.json(
        { error: 'このクーポンはまだ有効ではありません', valid: false },
        { status: 400 }
      );
    }

    if (coupon.validUntil && coupon.validUntil < now) {
      return NextResponse.json(
        { error: 'このクーポンの有効期限が切れています', valid: false },
        { status: 400 }
      );
    }

    // 使用回数チェック
    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: 'このクーポンの使用回数が上限に達しました', valid: false },
        { status: 400 }
      );
    }

    // すでに使用済みかチェック（同一ユーザー）
    if (coupon.used && coupon.usedBy === session.user.id) {
      return NextResponse.json(
        { error: 'このクーポンはすでに使用済みです', valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        applicablePlans: coupon.applicablePlans,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message, valid: false },
        { status: 400 }
      );
    }

    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { error: 'クーポンの検証中にエラーが発生しました', valid: false },
      { status: 500 }
    );
  }
}
