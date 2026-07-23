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

  return <PortfolioExperience settings={settings} posts={featuredPosts} projects={projects} experiences={experiences} skills={skills} />;
}
