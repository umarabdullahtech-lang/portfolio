import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
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

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Skills skills={skills} settings={settings} />
        <Projects projects={projects} />
        <Blog posts={featuredPosts} />
        <Experience experiences={experiences} />
        <Contact />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
