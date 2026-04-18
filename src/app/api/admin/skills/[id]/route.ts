import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const skill = await prisma.skill.update({ where: { id }, data: body });
  return NextResponse.json({ skill });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(request);
  if (error) return error;

  const { id } = await params;
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
