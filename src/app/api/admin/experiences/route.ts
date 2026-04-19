import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const experiences = await prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ experiences });
}

export async function POST(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { company, role, period, description, location, type, current, sortOrder } = body;
  const experience = await prisma.experience.create({
    data: { company, role, period, description, location, type, current, sortOrder },
  });
  return NextResponse.json({ experience }, { status: 201 });
}
