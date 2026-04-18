"use client";

import { motion, type Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Cpu, Globe, Zap, Users } from "lucide-react";

const highlights = [
  {
    icon: Cpu,
    title: "AI-First Engineering",
    desc: "Building intelligent systems with LLMs, RAG pipelines, and multi-agent architectures using LangChain and OpenAI.",
  },
  {
    icon: Globe,
    title: "Full-Stack Mastery",
    desc: "End-to-end development with Next.js, Node.js, and modern databases — from API design to polished UIs.",
  },
  {
    icon: Zap,
    title: "Automation Specialist",
    desc: "Creating robust automation workflows with Puppeteer, BullMQ, and event-driven architectures at scale.",
  },
  {
    icon: Users,
    title: "SaaS Platforms",
    desc: "Architecting multi-tenant SaaS products with scalable backends, billing integrations, and real-time features.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

type Props = { settings: Record<string, string> };

export default function About({ settings }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: settings.stat_years || "5+", label: settings.stat_years_label || "Years Experience" },
    { value: settings.stat_projects || "30+", label: settings.stat_projects_label || "Projects Shipped" },
    { value: settings.stat_ai || "10+", label: settings.stat_ai_label || "AI Systems Built" },
    { value: settings.stat_satisfaction || "99%", label: settings.stat_satisfaction_label || "Client Satisfaction" },
  ];

  const subtitle = settings.about_subtitle || "Passionate engineer who loves turning ambitious ideas into production systems.";
  const bio1 = settings.about_bio_1;
  const bio2 = settings.about_bio_2;
  const bio3 = settings.about_bio_3;

  return (
    <section id="about" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">
          About Me
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Crafting the Future with{" "}
          <span className="gradient-text">Code & AI</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          {subtitle}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="space-y-5 text-slate-400 leading-relaxed">
            {bio1 && <p>{bio1}</p>}
            {bio2 && <p>{bio2}</p>}
            {bio3 && <p>{bio3}</p>}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="text-center p-4 glass rounded-xl border border-white/5"
              >
                <div className="text-2xl font-extrabold gradient-text mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — highlight cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="glass rounded-2xl p-5 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group"
              whileHover={{ y: -4 }}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <item.icon size={18} className="text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
