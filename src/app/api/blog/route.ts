import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');

    const where: Record<string, unknown> = { status: 'published' };
    if (tag) where.tags = { has: tag };
    if (category) where.category = category;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: { page, limit, total },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { error, user } = requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { slug, title, excerpt, content, coverImage, tags, category, readingTime, status, featured } = body;

    if (!slug || !title || !excerpt || !content) {
      return NextResponse.json({ error: 'slug, title, excerpt, and content are required' }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        coverImage: coverImage || null,
        tags: tags || [],
        category: category || null,
        author: user!.email,
        readingTime: readingTime || 5,
        status: status || 'published',
        featured: featured || false,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    if (message.includes('Unique constraint')) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
