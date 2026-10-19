import { prisma } from './prisma';
import { recordToProject } from './project-record';
import { publicContactEmail } from './contact';

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
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  });
  return projects.map(recordToProject);
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findFirst({ where: { slug, published: true } });
  return project ? recordToProject(project) : null;
}

// Sample rows that earlier versions of prisma/seed.ts inserted. They are not real
// career history, so the public site never shows them; replace them in /admin.
const SAMPLE_EXPERIENCE_COMPANIES = ['TechCorp Inc.', 'StartupXYZ', 'Digital Agency Co.', 'University of Technology'];

export async function getExperiences() {
  return prisma.experience.findMany({
    where: { company: { notIn: SAMPLE_EXPERIENCE_COMPANIES } },
    orderBy: { sortOrder: 'asc' },
  });
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
  // Never ship a placeholder address to the page, not even in serialized props.
  if (map.contact_email && !publicContactEmail(map)) delete map.contact_email;
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
