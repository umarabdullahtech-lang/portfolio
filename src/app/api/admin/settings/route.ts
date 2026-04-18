import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const settings = await prisma.siteSetting.findMany();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { settings } = body as { settings: { key: string; value: string }[] };

  for (const { key, value } of settings) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  return NextResponse.json({ success: true });
}
