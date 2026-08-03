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
  const homeProjects = projects
    .filter((project) => project.category !== "Open-source Reference")
    .slice(0, 6);
  const liveProjectCount = projects.filter((project) => project.liveUrl && project.liveUrl !== "#").length;

  return (
    <PortfolioExperience
      settings={settings}
      posts={featuredPosts}
      projects={homeProjects}
      projectCount={projects.length}
      liveProjectCount={liveProjectCount}
      experiences={experiences}
      skills={skills}
    />
  );
}
