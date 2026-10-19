import type { Metadata } from "next";
import { getProjects, getSiteSettings } from "@/lib/data";
import WorkArchive from "@/components/WorkArchive";
import type { PortfolioProject } from "@/data/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Complete Project Archive | Umar Abdullah",
  description: "A complete archive of production systems, AI platforms, automation, applications, utilities, and reviewed engineering work by Umar Abdullah.",
};

const isLive = (project: PortfolioProject) => Boolean(project.liveUrl && project.liveUrl !== "#");
const isReference = (project: PortfolioProject) => project.category === "Open-source Reference";

function summarize(project: PortfolioProject) {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    category: project.category,
    role: project.role,
    techStack: project.techStack,
  };
}

export default async function WorkPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  // Open-source studies are listed separately so they never read as original work.
  const ownProjects = projects.filter((project) => !isReference(project));
  const liveProjects = ownProjects.filter(isLive);
  const documentedProjects = ownProjects.filter((project) => !isLive(project)).map(summarize);
  const referenceProjects = projects.filter(isReference).map(summarize);

  return (
    <WorkArchive
      liveProjects={liveProjects}
      documentedProjects={documentedProjects}
      referenceProjects={referenceProjects}
      settings={settings}
    />
  );
}
