"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Bot, Globe, Zap, Database, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";

type ProjectData = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  sortOrder: number;
};

type Props = { projects: ProjectData[] };

const iconMap: Record<number, React.ElementType> = {
  0: Bot,
  1: Globe,
  2: Zap,
  3: Database,
};

const colors = ["indigo", "violet", "cyan", "emerald"];

const colorBorder: Record<string, string> = {
  indigo: "border-indigo-500/30 hover:border-indigo-500/60",
  violet: "border-violet-500/30 hover:border-violet-500/60",
  cyan: "border-cyan-500/30 hover:border-cyan-500/60",
  emerald: "border-emerald-500/30 hover:border-emerald-500/60",
};
const colorIcon: Record<string, string> = {
  indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
  violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
};
const colorTag: Record<string, string> = {
  indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
};

export default function Projects({ projects }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="projects" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Projects
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Things I&apos;ve <span className="gradient-text">Built</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A selection of projects that showcase my expertise in AI engineering and full-stack development.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project, i) => {
            const color = colors[i % colors.length];
            const Icon = iconMap[i % 4];
            const desc = project.description;
            const shortDesc = desc.length > 120 ? desc.slice(0, 120) + "..." : desc;
            const isExpanded = expanded === project.id;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`glass rounded-2xl p-6 border ${colorBorder[color]} transition-all duration-300 flex flex-col`}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${colorIcon[color]}`}>
                    <Icon size={20} />
                  </div>
                  {project.featured && (
                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-white font-bold text-lg mb-2">{project.title}</h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                  {isExpanded ? desc : shortDesc}
                </p>

                {desc.length > 120 && (
                  <button
                    onClick={() => setExpanded(isExpanded ? null : project.id)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 mb-4 transition-colors cursor-pointer"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                    <ArrowRight size={12} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>
                )}

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.techStack.map((tag) => (
                    <span key={tag} className={`text-xs px-2 py-0.5 rounded-full border ${colorTag[color]}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-auto">
                  {project.githubUrl && project.githubUrl !== "#" && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                      <GithubIcon size={14} /> Code
                    </a>
                  )}
                  {project.liveUrl && project.liveUrl !== "#" && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/umarabdullahtech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-200"
          >
            <GithubIcon size={16} />
            View All Projects on GitHub
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
