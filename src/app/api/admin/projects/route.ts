import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';
import { normalizeProjectInput, recordToProject } from '@/lib/project-record';

export async function GET(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  const projects = await prisma.project.findMany({ orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }] });
  return NextResponse.json({ projects: projects.map(recordToProject), total: projects.length });
}

export async function POST(request: Request) {
  const { error } = requireAuth(request);
  if (error) return error;

  try {
    const data = normalizeProjectInput(await request.json());
    const project = await prisma.project.create({ data });
    return NextResponse.json({ project: recordToProject(project) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create project';
    const status = message.includes('Unique constraint') ? 409 : 400;
    return NextResponse.json({ error: status === 409 ? 'A project with this slug already exists' : message }, { status });
  }
}
