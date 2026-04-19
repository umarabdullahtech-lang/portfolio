import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const projects = await prisma.project.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { title, description, techStack, liveUrl, githubUrl, image, featured, sortOrder } = body;
  const project = await prisma.project.create({
    data: { title, description, techStack, liveUrl, githubUrl, image, featured, sortOrder },
  });
  return NextResponse.json({ project }, { status: 201 });
}
