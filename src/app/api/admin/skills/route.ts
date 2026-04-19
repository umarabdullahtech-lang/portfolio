import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const skills = await prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ skills });
}

export async function POST(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { name, category, proficiency, sortOrder } = body;
  const skill = await prisma.skill.create({
    data: { name, category, proficiency, sortOrder },
  });
  return NextResponse.json({ skill }, { status: 201 });
}
