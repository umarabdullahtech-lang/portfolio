import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const [posts, projects, experiences, skills, contacts] = await Promise.all([
    prisma.blogPost.count(),
    prisma.project.count(),
    prisma.experience.count(),
    prisma.skill.count(),
    prisma.contactSubmission.count(),
  ]);

  const unreadContacts = await prisma.contactSubmission.count({ where: { read: false } });

  return NextResponse.json({ posts, projects, experiences, skills, contacts, unreadContacts });
}
