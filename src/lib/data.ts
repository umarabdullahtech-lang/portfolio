import { prisma } from './prisma';

export async function getBlogPosts() {
  return prisma.blogPost.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
  });
}

export async function getFeaturedPosts() {
  return prisma.blogPost.findMany({
    where: { status: 'published', featured: true },
    orderBy: { publishedAt: 'desc' },
  });
}

export async function getBlogPost(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function getProjects() {
  return prisma.project.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getExperiences() {
  return prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getSkills() {
  return prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map;
}

export async function createContactSubmission(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  return prisma.contactSubmission.create({ data });
}
