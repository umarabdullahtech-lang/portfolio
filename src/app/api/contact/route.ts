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

// `field` names the input the message belongs to, so the form can show it in place.
function invalid(field: 'name' | 'email' | 'subject' | 'message', error: string) {
  return NextResponse.json({ error, field }, { status: 400 });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT);

  if (!rateLimit.allowed) {
    const minutes = Math.max(1, Math.ceil(rateLimit.retryAfterSeconds / 60));
    return NextResponse.json(
      { error: `Too many messages from this connection. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.` },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    );
  }

  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name) return invalid('name', 'Enter your name');
    if (!email) return invalid('email', 'Enter your email address');
    if (!message) return invalid('message', 'Enter a message');

    if (typeof name !== 'string' || name.length > 200) {
      return invalid('name', 'Use a name of 200 characters or fewer');
    }

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254) {
      return invalid('email', 'Enter an email address like name@company.com');
    }

    if (subject !== undefined && subject !== null && (typeof subject !== 'string' || subject.length > 500)) {
      return invalid('subject', 'Keep the subject to 500 characters or fewer');
    }

    if (typeof message !== 'string' || message.length > 5000) {
      return invalid('message', 'Keep the message to 5,000 characters or fewer');
    }

    const submission = await createContactSubmission({
      name: sanitizeContactField(name),
      email: sanitizeContactField(email),
      subject: subject ? sanitizeContactField(subject) : undefined,
      message: sanitizeContactField(message),
    });
    return NextResponse.json({ success: true, id: submission.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
