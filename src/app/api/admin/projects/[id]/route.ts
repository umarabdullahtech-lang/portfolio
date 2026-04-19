import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(request);
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { title, description, techStack, liveUrl, githubUrl, image, featured, sortOrder } = body;
  const project = await prisma.project.update({
    where: { id },
    data: { title, description, techStack, liveUrl, githubUrl, image, featured, sortOrder },
  });
  return NextResponse.json({ project });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(request);
  if (error) return error;

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
