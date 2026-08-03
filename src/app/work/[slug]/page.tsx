import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects, getSiteSettings } from "@/lib/data";
import ProjectCaseStudy from "@/components/ProjectCaseStudy";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Case Study Not Found | Umar Abdullah" };
  return {
    title: `${project.title} - Case Study | Umar Abdullah`,
    description: project.description,
    openGraph: {
      title: `${project.title} - Engineering Case Study`,
      description: project.shortDescription,
      images: [{ url: project.image, alt: project.imageAlt }],
    },
  };
}

export default async function WorkCasePage({ params }: Props) {
  const { slug } = await params;
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  const index = projects.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const nextProject = projects[(index + 1) % projects.length];
  return <ProjectCaseStudy project={projects[index]} nextProject={nextProject} settings={settings} />;
}
