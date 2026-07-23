import type { Metadata } from "next";
import { getProjects, getSiteSettings } from "@/lib/data";
import WorkArchive from "@/components/WorkArchive";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Selected Work | Umar Abdullah",
  description: "Production AI systems, SaaS platforms, and distributed automation infrastructure designed and engineered by Umar Abdullah.",
};

export default async function WorkPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);
  return <WorkArchive projects={projects} settings={settings} />;
}
