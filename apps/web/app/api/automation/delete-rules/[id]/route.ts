import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT - Update a delete rule
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
    const existingRule = await prisma.autoDeleteRule.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existingRule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 403 });
    }

    const body = await request.json();
    const { deleteAfterDays, enabled } = body;

    // Build update data
    const updateData: any = {};
    if (deleteAfterDays !== undefined) updateData.deleteAfterDays = deleteAfterDays;
    if (enabled !== undefined) updateData.enabled = enabled;

    // Validate
    if (updateData.deleteAfterDays && updateData.deleteAfterDays < 1) {
      return NextResponse.json({ error: 'Invalid deleteAfterDays value' }, { status: 400 });
    }

    const updatedRule = await prisma.autoDeleteRule.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedRule);
  } catch (error) {
    console.error('Error updating delete rule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a delete rule
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
    // Verify rule belongs to user
    const existingRule = await prisma.autoDeleteRule.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existingRule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 403 });
    }

    await prisma.autoDeleteRule.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Rule deleted' });
  } catch (error) {
    console.error('Error deleting delete rule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
