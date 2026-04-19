import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { error } = requireAuth(request);
  if (error) return error;

  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, excerpt, content, coverImage, tags, category, readingTime, status, featured } = body;

    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...(title !== undefined && { title }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(tags !== undefined && { tags }),
        ...(category !== undefined && { category }),
        ...(readingTime !== undefined && { readingTime }),
        ...(status !== undefined && { status }),
        ...(featured !== undefined && { featured }),
      },
    });

    return NextResponse.json({ post });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { error } = requireAuth(request);
  if (error) return error;

  try {
    const { slug } = await params;
    await prisma.blogPost.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
