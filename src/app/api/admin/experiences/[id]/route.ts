import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const experience = await prisma.experience.update({ where: { id }, data: body });
  return NextResponse.json({ experience });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(request);
  if (error) return error;

  const { id } = await params;
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
