import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT - Update a plug rule
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
    const existingRule = await prisma.autoPlugRule.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existingRule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 403 });
    }

    const body = await request.json();
    const { plugTemplateId, enabled } = body;

    // Build update data
    const updateData: any = {};
    if (plugTemplateId !== undefined) {
      // Verify plug template belongs to user
      const template = await prisma.plugTemplate.findFirst({
        where: { id: plugTemplateId, userId: session.user.id },
      });
      if (!template) {
        return NextResponse.json({ error: 'Plug template not found' }, { status: 403 });
      }
      updateData.plugTemplateId = plugTemplateId;
    }
    if (enabled !== undefined) updateData.enabled = enabled;

    const updatedRule = await prisma.autoPlugRule.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedRule);
  } catch (error) {
    console.error('Error updating plug rule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a plug rule
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
    const existingRule = await prisma.autoPlugRule.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existingRule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 403 });
    }

    await prisma.autoPlugRule.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Rule deleted' });
  } catch (error) {
    console.error('Error deleting plug rule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
