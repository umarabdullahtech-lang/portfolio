"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, Bot, Database, ExternalLink, Globe, Zap } from "lucide-react";
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

const icons = [Bot, Globe, Zap, Database];

export default function Projects({ projects }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(projects[0]?.id ?? null);

  return (
    <section id="projects" ref={ref} className="relative overflow-hidden border-t-[3px] border-black px-5 py-28 sm:px-8 md:py-40 lg:px-10">
      <div className="register-mark left-6 top-10" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 grid gap-8 lg:grid-cols-[0.75fr_0.45fr] lg:items-end"
        >
          <div>
            <span className="kicker mb-6">work.query --featured</span>
            <h2 className="section-heading text-black">
              Things I&apos;ve <span className="text-[var(--signal)]">Built</span>
            </h2>
          </div>
          <p className="border-l-[6px] border-[var(--signal)] pl-5 text-lg font-semibold leading-relaxed text-[#34322d]">
            A selection of projects that showcase my expertise in AI engineering and full-stack development.
          </p>
        </motion.header>

        <div className="flex flex-col gap-5 lg:h-[610px] lg:flex-row lg:items-stretch">
          {projects.map((project, index) => {
            const Icon = icons[index % icons.length];
            const isActive = active === project.id;

            return (
              <motion.article
                key={project.id}
                tabIndex={0}
                initial={{ opacity: 0, y: 35 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                onMouseEnter={() => setActive(project.id)}
                onFocus={() => setActive(project.id)}
                onClick={() => setActive(project.id)}
                className={`relative flex min-h-[420px] flex-col overflow-hidden border-[3px] border-black p-5 shadow-[8px_8px_0_#0a0a0a] transition-[flex,background-color] duration-500 sm:p-6 lg:min-h-0 ${
                  isActive ? "bg-[var(--signal)] lg:flex-[2.25]" : "bg-[var(--paper)] lg:flex-1"
                }`}
              >
                <div className="flex items-start justify-between gap-5 border-b-[3px] border-black pb-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border-[3px] border-black bg-black text-[var(--paper)]">
                    <Icon size={21} strokeWidth={2.7} />
                  </div>
                  <div className="text-right font-mono">
                    <span className="block text-4xl font-black leading-none text-black">{String(index + 1).padStart(2, "0")}</span>
                    {project.featured && <span className="mt-2 block text-[9px] font-black uppercase tracking-wider text-black">featured.build</span>}
                  </div>
                </div>

                <h3 className="mt-6 text-[clamp(1.65rem,2.6vw,3.25rem)] font-black uppercase leading-[0.92] tracking-[-0.055em] text-black">
                  {project.title}
                </h3>

                <div
                  className={`mt-6 flex flex-1 flex-col transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "lg:opacity-65"
                  }`}
                >
                  <p className="max-w-2xl text-sm font-semibold leading-relaxed text-[#282621] sm:text-base">{project.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="border-2 border-black bg-[var(--paper)] px-2.5 py-1.5 font-mono text-[9px] font-black uppercase tracking-wide text-black">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
                    {project.githubUrl && project.githubUrl !== "#" && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hard-button hard-button--dark min-h-0 px-4 py-3">
                        <GithubIcon size={14} /> Code
                      </a>
                    )}
                    {project.liveUrl && project.liveUrl !== "#" && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hard-button min-h-0 px-4 py-3">
                        <ExternalLink size={14} /> Live demo
                      </a>
                    )}
                    {!project.githubUrl && !project.liveUrl && (
                      <span className="font-mono text-[9px] font-black uppercase tracking-[0.08em] text-black">case study / private system</span>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.45 }}
          className="mt-14 flex justify-end"
        >
          <a
            href="https://github.com/umarabdullahtech"
            target="_blank"
            rel="noopener noreferrer"
            className="hard-button hard-button--dark px-6 py-4"
          >
            <GithubIcon size={16} />
            View all projects on GitHub
            <ArrowUpRight size={16} strokeWidth={3} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
