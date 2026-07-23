"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar, GraduationCap, MapPin } from "lucide-react";

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
  const careerSummary = "10 years in software engineering. 5 years specializing in AI engineering.";

  return (
    <section id="experience" ref={ref} className="relative overflow-hidden border-t-[3px] border-black bg-[var(--paper-deep)] px-5 py-28 sm:px-8 md:py-40 lg:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-50 blueprint-grid" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-20 grid gap-9 lg:grid-cols-[0.8fr_0.4fr] lg:items-end"
        >
          <div>
            <span className="kicker mb-6">career.log --selected</span>
            <h2 className="section-heading text-black">
              My <span className="text-[var(--signal)]">Journey</span>
            </h2>
          </div>
          <div className="border-[3px] border-black bg-[var(--paper)] p-5 shadow-[6px_6px_0_#0a0a0a]">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.1em] text-[var(--signal-dark)]">career summary</p>
            <p data-scrub-text className="mt-3 text-xl font-black uppercase leading-tight tracking-[-0.035em] text-black">
              {careerSummary.split(" ").map((word, index) => (
                <span key={`${word}-${index}`} className="inline-block">
                  {word}{index < careerSummary.split(" ").length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </p>
          </div>
        </motion.header>

        <div className="relative mx-auto max-w-5xl">
          <div className="pointer-events-none absolute bottom-0 left-5 top-0 w-[3px] bg-black md:left-1/2" aria-hidden="true" />
          <div className="space-y-16 md:space-y-24">
            {experiences.map((item, index) => {
              const isLeft = index % 2 === 0;
              const Icon = item.type === "education" ? GraduationCap : Briefcase;
              const descLines = item.description.split("\n").filter(Boolean);

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, x: isLeft ? -32 : 32 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.12, duration: 0.55 }}
                  className={`relative grid md:grid-cols-2 ${isLeft ? "" : "md:[&>*:last-child]:col-start-2"}`}
                  data-stack-card
                >
                  <span className="absolute left-5 top-8 z-10 h-5 w-5 -translate-x-[8px] border-[3px] border-black bg-[var(--signal)] md:left-1/2" aria-hidden="true" />

                  <div className={`ml-12 md:ml-0 ${isLeft ? "md:pr-12" : "md:col-start-2 md:pl-12"}`}>
                    <div className="brutal-card hard-press overflow-hidden bg-[var(--paper)]">
                      <div className="terminal-bar">
                        <span>entry_{String(index + 1).padStart(2, "0")}.json</span>
                        <span>{item.current ? "active" : "archived"}</span>
                      </div>
                      <div className="p-6 sm:p-7">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center border-[3px] border-black bg-black text-[var(--paper)]">
                            <Icon size={19} strokeWidth={2.6} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black uppercase leading-tight tracking-[-0.04em] text-black">{item.role}</h3>
                            <p className="mt-1 font-mono text-xs font-black uppercase tracking-wide text-[var(--signal-dark)]">{item.company}</p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-y-2 border-black py-3 font-mono text-[9px] font-black uppercase tracking-wider text-black">
                          <span className="flex items-center gap-2"><Calendar size={13} /> {item.period}</span>
                          {item.location && <span className="flex items-center gap-2"><MapPin size={13} /> {item.location}</span>}
                        </div>

                        <ul className="mt-5 space-y-3">
                          {descLines.map((line) => (
                            <li key={line} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-[#34322d]">
                              <span className="mt-2 h-2 w-2 shrink-0 bg-[var(--signal)] outline outline-2 outline-black" />
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
