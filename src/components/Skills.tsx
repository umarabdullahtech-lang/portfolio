"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type SkillData = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
};

type Props = {
  skills: SkillData[];
  settings: Record<string, string>;
};

export default function Skills({ skills, settings }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const categories = new Map<string, SkillData[]>();
  for (const skill of skills) {
    const items = categories.get(skill.category) || [];
    items.push(skill);
    categories.set(skill.category, items);
  }

  let techBadges: string[] = [];
  try {
    techBadges = JSON.parse(settings.tech_badges || "[]");
  } catch {
    techBadges = [];
  }

  return (
    <section id="skills" ref={ref} className="relative overflow-hidden border-t-[3px] border-black bg-[var(--paper-deep)] px-5 py-28 sm:px-8 md:py-36 lg:px-10">
      <div className="pointer-events-none absolute right-0 top-0 font-mono text-[clamp(8rem,24vw,22rem)] font-black leading-none text-black/[0.035]" aria-hidden="true">
        STACK
      </div>
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative mb-16 grid gap-8 lg:grid-cols-[0.75fr_0.45fr] lg:items-end"
        >
          <div>
            <span className="kicker mb-6">stack.inspect --all</span>
            <h2 className="section-heading text-black">
              My <span className="text-[var(--signal)]">Tech Stack</span>
            </h2>
          </div>
          <p className="border-l-[6px] border-black pl-5 text-lg font-semibold leading-relaxed text-[#34322d]">
            A curated set of tools and technologies I use to build exceptional products.
          </p>
        </motion.header>

        <div className="grid grid-flow-dense gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from(categories.entries()).map(([category, items], categoryIndex) => (
            <motion.article
              key={category}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: categoryIndex * 0.08, duration: 0.5 }}
              className={`brutal-card hard-press overflow-hidden ${categoryIndex % 2 ? "xl:translate-y-10" : ""}`}
            >
              <div className="flex items-center justify-between border-b-[3px] border-black bg-black px-5 py-4 text-[var(--paper)]">
                <h3 className="font-mono text-xs font-black uppercase tracking-[0.1em] text-[var(--paper)]">{category}</h3>
                <span className="font-mono text-[10px] font-bold text-[var(--signal)]">[{String(categoryIndex + 1).padStart(2, "0")}]</span>
              </div>
              <div className="space-y-6 p-5">
                {items.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="mb-2 flex items-end justify-between gap-3">
                      <span className="text-sm font-extrabold text-black">{skill.name}</span>
                      <output className="text-xs font-black text-[var(--signal-dark)]">{skill.proficiency}%</output>
                    </div>
                    <div className="h-3 border-2 border-black bg-[var(--paper-deep)]">
                      <motion.div
                        className="h-full border-r-2 border-black bg-[var(--signal)]"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                        transition={{ delay: categoryIndex * 0.07 + skillIndex * 0.06 + 0.25, duration: 0.7, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        {techBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-24 border-[3px] border-black bg-[var(--paper)] shadow-[8px_8px_0_#0a0a0a]"
          >
            <div className="terminal-bar">
              <span>package.manifest</span>
              <span>{techBadges.length} modules loaded</span>
            </div>
            <div className="flex flex-wrap gap-0 p-4 sm:p-6">
              {techBadges.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.42 + index * 0.025, duration: 0.2 }}
                  whileHover={{ y: -3, backgroundColor: "#ff3b19" }}
                  className="-ml-[2px] -mt-[2px] border-2 border-black px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.06em] text-black"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
