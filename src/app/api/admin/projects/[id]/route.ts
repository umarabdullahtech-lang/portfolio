import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-middleware';
import { normalizeProjectInput, recordToProject } from '@/lib/project-record';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(request);
  if (error) return error;

  try {
    const { id } = await params;
    const data = normalizeProjectInput(await request.json());
    const project = await prisma.project.update({ where: { id }, data });
    return NextResponse.json({ project: recordToProject(project) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update project';
    const notFound = message.includes('Record to update not found');
    const conflict = message.includes('Unique constraint');
    return NextResponse.json(
      { error: notFound ? 'Project not found' : conflict ? 'A project with this slug already exists' : message },
      { status: notFound ? 404 : conflict ? 409 : 400 },
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(request);
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    return NextResponse.json(
      { error: message.includes('Record to delete does not exist') ? 'Project not found' : 'Unable to delete project' },
      { status: message.includes('Record to delete does not exist') ? 404 : 500 },
    );
  }
}
