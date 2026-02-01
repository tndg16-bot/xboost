import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List all connected Twitter accounts
export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accounts = await prisma.twitterAccount.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isActive: 'desc' }, { order: 'asc' }],
  });

  return NextResponse.json(accounts);
}

// POST - Connect a new Twitter account
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, role = 'SUB', color = '#3B82F6' } = body;

    // For simplicity, this is a mock connection
    // In production, you'd redirect to Twitter OAuth flow
    const account = await prisma.twitterAccount.create({
      data: {
        userId: session.user.id,
        twitterId: `mock_${Date.now()}`,
        username,
        role,
        color,
        accessToken: 'mock_token',
        tokenExpiresAt: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Error connecting Twitter account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Disconnect a Twitter account
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  try {
    const account = await prisma.twitterAccount.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    await prisma.twitterAccount.delete({
      where: { id },
    });

    // Reset active account if this was the active one
    if (session.user.activeAccountId === id) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { activeAccountId: null },
      });
    }

    return NextResponse.json({ message: 'Account disconnected' });
  } catch (error) {
    console.error('Error disconnecting Twitter account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Switch active account
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { twitterAccountId } = body;

    // Verify account belongs to user
    const account = await prisma.twitterAccount.findFirst({
      where: { id: twitterAccountId, userId: session.user.id },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Update active account
    await prisma.user.update({
      where: { id: session.user.id },
      data: { activeAccountId: twitterAccountId },
    });

    return NextResponse.json({ message: 'Active account switched' });
  } catch (error) {
    console.error('Error switching account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
