import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

interface RouteContext {
  params: { id: string };
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify ownership
  const account = await db.twitterAccount.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!account) {
    return NextResponse.json({ error: 'Twitter account not found' }, { status: 404 });
  }

  // Update user's active account
  await db.user.update({
    where: { id: session.user.id },
    data: { activeAccountId: params.id },
  });

  return NextResponse.json({
    success: true,
    activeAccountId: params.id,
    account: {
      id: account.id,
      username: account.username,
      displayName: account.displayName,
      role: account.role,
    },
  });
}
