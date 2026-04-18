"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";

type ExperienceData = {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  location: string | null;
  type: string | null;
  current: boolean;
  sortOrder: number;
};

type Props = { experiences: ExperienceData[] };

export default function Experience({ experiences }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Experience
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            My <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            5+ years of building, shipping, and iterating on products that users love.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/40 via-violet-500/20 to-transparent" />

          <div className="space-y-8">
            {experiences.map((item, i) => {
              const isLeft = i % 2 === 0;
              const descLines = item.description.split('\n').filter(Boolean);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-4 sm:left-1/2 top-6 w-3 h-3 rounded-full bg-indigo-500 border-2 border-indigo-300 shadow-lg shadow-indigo-500/50 -translate-x-1/2 z-10" />
                  <div className="hidden sm:block sm:w-1/2" />

                  <div className={`ml-10 sm:ml-0 sm:w-1/2 ${isLeft ? "sm:pr-10" : "sm:pl-10"}`}>
                    <motion.div
                      className="glass rounded-2xl p-6 border border-white/5 hover:border-indigo-500/30 transition-all duration-300"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {item.type === "education" ? (
                              <GraduationCap size={14} className="text-violet-400" />
                            ) : (
                              <Briefcase size={14} className="text-indigo-400" />
                            )}
                            <h3 className="text-white font-bold text-base">{item.role}</h3>
                          </div>
                          <p className="text-indigo-300 text-sm font-medium">{item.company}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-slate-500 text-xs justify-end">
                            <Calendar size={11} />
                            {item.period}
                          </div>
                          {item.location && (
                            <p className="text-slate-600 text-xs mt-0.5">{item.location}</p>
                          )}
                        </div>
                      </div>

                      <ul className="space-y-1.5 mb-4">
                        {descLines.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-slate-400 text-xs leading-relaxed">
                            <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
