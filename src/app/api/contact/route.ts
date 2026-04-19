import { NextResponse } from 'next/server';
import { createContactSubmission } from '@/lib/data';
import { checkRateLimit } from '@/lib/rate-limit';
import { sanitizeContactField } from '@/lib/sanitize';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_RATE_LIMIT = { maxAttempts: 5, windowMs: 15 * 60 * 1000 };

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    );
  }

  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    if (typeof name !== 'string' || name.length > 200) {
      return NextResponse.json({ error: 'Name must be 200 characters or less' }, { status: 400 });
    }

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (subject !== undefined && subject !== null && (typeof subject !== 'string' || subject.length > 500)) {
      return NextResponse.json({ error: 'Subject must be 500 characters or less' }, { status: 400 });
    }

    if (typeof message !== 'string' || message.length > 5000) {
      return NextResponse.json({ error: 'Message must be 5000 characters or less' }, { status: 400 });
    }

    const submission = await createContactSubmission({
      name: sanitizeContactField(name),
      email: sanitizeContactField(email),
      subject: subject ? sanitizeContactField(subject) : null,
      message: sanitizeContactField(message),
    });
    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
