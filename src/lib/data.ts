import { prisma } from './prisma';
import { portfolioProjects } from '@/data/projects';

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
  const storedProjects = await prisma.project.findMany({
    where: { id: { in: portfolioProjects.map((project) => project.id) } },
  });
  const storedById = new Map(storedProjects.map((project) => [project.id, project]));

  return portfolioProjects
    .map((project) => {
      const stored = storedById.get(project.id);
      if (!stored) return project;
      return {
        ...project,
        title: stored.title,
        description: stored.description,
        techStack: stored.techStack,
        liveUrl: stored.liveUrl || project.liveUrl,
        githubUrl: stored.githubUrl,
        image: stored.image || project.image,
        featured: stored.featured,
        sortOrder: stored.sortOrder,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
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
