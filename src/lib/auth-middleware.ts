import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeaders } from './auth';

function getTokenFromCookies(headers: Headers): string | null {
  const cookie = headers.get('cookie');
  if (!cookie) return null;
  const match = cookie.match(/(?:^|;\s*)admin_token=([^;]*)/);
  return match ? match[1] : null;
}

export function requireAuth(request: Request) {
  const token = getTokenFromCookies(request.headers) ?? getTokenFromHeaders(request.headers);
  if (!token) {
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }), user: null };
  }

  const user = verifyToken(token);
  if (!user) {
    return { error: NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 }), user: null };
  }

  return { error: null, user };
}
