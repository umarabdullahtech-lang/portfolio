import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request: Request) {
  const { error, user } = requireAuth(request);
  if (error) return error;

  return NextResponse.json({ user });
}
