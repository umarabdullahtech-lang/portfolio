import PortfolioExperience from "@/components/PortfolioExperience";
import {
  getSiteSettings,
  getFeaturedPosts,
  getProjects,
  getExperiences,
  getSkills,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, featuredPosts, projects, experiences, skills] = await Promise.all([
    getSiteSettings(),
    getFeaturedPosts(),
    getProjects(),
    getExperiences(),
    getSkills(),
  ]);
  // Open-source studies are reviewed, not authored, so they stay out of the counts.
  const ownProjects = projects.filter((project) => project.category !== "Open-source Reference");
  const homeProjects = ownProjects.slice(0, 6);
  const liveProjectCount = ownProjects.filter((project) => project.liveUrl && project.liveUrl !== "#").length;

  return (
    <PortfolioExperience
      settings={settings}
      posts={featuredPosts}
      projects={homeProjects}
      projectCount={ownProjects.length}
      liveProjectCount={liveProjectCount}
      experiences={experiences}
      skills={skills}
    />
  );
}
