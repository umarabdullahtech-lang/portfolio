import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeaders } from './auth';

export function requireAuth(request: Request) {
  const token = getTokenFromHeaders(request.headers);
  if (!token) {
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }), user: null };
  }

  const user = verifyToken(token);
  if (!user) {
    return { error: NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 }), user: null };
  }

  return { error: null, user };
}
