import type { Metadata } from "next";
import { getProjects, getSiteSettings } from "@/lib/data";
import WorkArchive from "@/components/WorkArchive";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Complete Project Archive | Umar Abdullah",
  description: "A complete archive of production systems, AI platforms, automation, applications, utilities, and reviewed engineering work by Umar Abdullah.",
};

export default async function WorkPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  const liveProjects = projects.filter((project) => project.liveUrl && project.liveUrl !== "#");
  const documentedProjects = projects
    .filter((project) => !project.liveUrl || project.liveUrl === "#")
    .map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      shortDescription: project.shortDescription,
      category: project.category,
      role: project.role,
      techStack: project.techStack,
    }));

  return <WorkArchive liveProjects={liveProjects} documentedProjects={documentedProjects} settings={settings} />;
}
