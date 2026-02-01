import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get a single scheduled post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;
  const post = await prisma.scheduledPost.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

// PUT - Update a scheduled post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  try {
    const body = await request.json();
    const { content, scheduledAt } = body;

    // Verify post belongs to user
    const existingPost = await prisma.scheduledPost.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (content !== undefined) updateData.content = content;
    if (scheduledAt !== undefined) updateData.scheduledAt = new Date(scheduledAt);

    const updatedPost = await prisma.scheduledPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating scheduled post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Cancel a scheduled post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  try {
    // Verify post belongs to user
    const existingPost = await prisma.scheduledPost.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.scheduledPost.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Scheduled post cancelled' });
  } catch (error) {
    console.error('Error cancelling scheduled post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
