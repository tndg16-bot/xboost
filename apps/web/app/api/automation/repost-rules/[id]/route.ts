import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT - Update a repost rule
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
    // Verify rule belongs to user
    const existingRule = await prisma.autoRepostRule.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existingRule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 403 });
    }

    const body = await request.json();
    const { thresholdType, thresholdValue, delayMinutes, enabled } = body;

    // Build update data
    const updateData: any = {};
    if (thresholdType !== undefined) updateData.thresholdType = thresholdType;
    if (thresholdValue !== undefined) updateData.thresholdValue = thresholdValue;
    if (delayMinutes !== undefined) updateData.delayMinutes = delayMinutes;
    if (enabled !== undefined) updateData.enabled = enabled;

    // Validate
    if (updateData.thresholdType && !['likes', 'retweets', 'impressions'].includes(updateData.thresholdType)) {
      return NextResponse.json({ error: 'Invalid threshold type' }, { status: 400 });
    }

    const updatedRule = await prisma.autoRepostRule.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedRule);
  } catch (error) {
    console.error('Error updating repost rule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a repost rule
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
    // Verify rule belongs to user
    const existingRule = await prisma.autoRepostRule.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existingRule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 403 });
    }

    await prisma.autoRepostRule.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Rule deleted' });
  } catch (error) {
    console.error('Error deleting repost rule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
