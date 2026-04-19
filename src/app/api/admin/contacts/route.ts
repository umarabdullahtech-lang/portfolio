import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const contacts = await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ contacts });
}

export async function PATCH(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const { id, read } = await request.json();
  const contact = await prisma.contactSubmission.update({
    where: { id },
    data: { read },
  });
  return NextResponse.json({ contact });
}
