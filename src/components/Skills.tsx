"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
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

const categoryColors: Record<string, string> = {
  Frontend: "indigo",
  Backend: "violet",
  "AI / ML": "cyan",
  Infrastructure: "emerald",
};

const colorMap: Record<string, string> = {
  indigo: "from-indigo-500 to-indigo-600",
  violet: "from-violet-500 to-violet-600",
  cyan: "from-cyan-500 to-cyan-600",
  emerald: "from-emerald-500 to-emerald-600",
};

const borderMap: Record<string, string> = {
  indigo: "border-indigo-500/30",
  violet: "border-violet-500/30",
  cyan: "border-cyan-500/30",
  emerald: "border-emerald-500/30",
};

const textMap: Record<string, string> = {
  indigo: "text-indigo-400",
  violet: "text-violet-400",
  cyan: "text-cyan-400",
  emerald: "text-emerald-400",
};

export default function Skills({ skills, settings }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // Group skills by category
  const categories = new Map<string, SkillData[]>();
  for (const skill of skills) {
    const arr = categories.get(skill.category) || [];
    arr.push(skill);
    categories.set(skill.category, arr);
  }

  const skillCategories = Array.from(categories.entries()).map(([category, items]) => ({
    category,
    color: categoryColors[category] || "indigo",
    skills: items.map((s) => ({ name: s.name, level: s.proficiency })),
  }));

  let techBadges: string[] = [];
  try {
    techBadges = JSON.parse(settings.tech_badges || "[]");
  } catch {
    techBadges = [];
  }

  return (
    <section id="skills" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Skills
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            My <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A curated set of tools and technologies I use to build exceptional products.
          </p>
        </motion.div>

        {/* Skill bars grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: ci * 0.1, duration: 0.6 }}
              className={`glass rounded-2xl p-6 border ${borderMap[cat.color] || "border-indigo-500/30"} hover:shadow-lg transition-all duration-300`}
            >
              <h3 className={`text-sm font-bold uppercase tracking-wider ${textMap[cat.color] || "text-indigo-400"} mb-5`}>
                {cat.category}
              </h3>
              <div className="space-y-4">
                {cat.skills.map((skill, si) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-slate-300 text-xs font-medium">{skill.name}</span>
                      <span className="text-slate-500 text-xs">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${colorMap[cat.color] || "from-indigo-500 to-indigo-600"}`}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ delay: ci * 0.1 + si * 0.1 + 0.4, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech badge cloud */}
        {techBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center"
          >
            <p className="text-slate-500 text-sm mb-6 uppercase tracking-wider">Also working with</p>
            <div className="flex flex-wrap justify-center gap-2">
              {techBadges.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.04, duration: 0.3 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="px-3 py-1.5 glass rounded-full text-xs font-medium text-slate-300 border border-white/8 hover:border-indigo-500/30 hover:text-indigo-300 transition-all duration-200 cursor-default"
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
