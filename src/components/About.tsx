"use client";

import { motion, type Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Cpu, Globe, Users, Zap } from "lucide-react";

const highlights = [
  {
    icon: Cpu,
    title: "AI-First Engineering",
    desc: "Building intelligent systems with LLMs, RAG pipelines, and multi-agent architectures using LangChain and OpenAI.",
    command: "ai.run()",
  },
  {
    icon: Globe,
    title: "Full-Stack Mastery",
    desc: "End-to-end development with Next.js, Node.js, and modern databases, from API design to polished UIs.",
    command: "stack.ship()",
  },
  {
    icon: Zap,
    title: "Automation Specialist",
    desc: "Creating robust automation workflows with Puppeteer, BullMQ, and event-driven architectures at scale.",
    command: "ops.scale()",
  },
  {
    icon: Users,
    title: "SaaS Platforms",
    desc: "Architecting multi-tenant SaaS products with scalable backends, billing integrations, and real-time features.",
    command: "saas.build()",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

type Props = { settings: Record<string, string> };

export default function About({ settings }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      value: settings.stat_software_years || "10+",
      label: settings.stat_software_years_label || "Years Software Engineering",
    },
    {
      value: settings.stat_ai_years || "5+",
      label: settings.stat_ai_years_label || "Years AI Engineering",
    },
    { value: settings.stat_projects || "30+", label: settings.stat_projects_label || "Projects Shipped" },
    {
      value: settings.stat_satisfaction || "99%",
      label: settings.stat_satisfaction_label || "Client Satisfaction",
    },
  ];

  const subtitle =
    settings.about_subtitle || "Passionate engineer who loves turning ambitious ideas into production systems.";
  const bio1 = (
    settings.about_bio_1 ||
    "I'm Umar Abdullah, a Senior Software Engineer & AI Engineer with a passion for building systems that matter. With 10 years in software engineering and 5 years specializing in AI engineering, I architect AI-powered applications and scalable SaaS platforms that drive real business value."
  ).replace(
    /With over 5 years of experience,/i,
    "With 10 years in software engineering and 5 years specializing in AI engineering,"
  );
  const bios = [bio1, settings.about_bio_2, settings.about_bio_3].filter(Boolean);

  return (
    <section id="about" ref={ref} className="section-rule relative overflow-hidden px-5 py-28 sm:px-8 md:py-36 lg:px-10">
      <div className="register-mark right-6 top-10" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 grid gap-8 border-b-[3px] border-black pb-10 lg:grid-cols-[1fr_0.55fr] lg:items-end"
        >
          <div>
            <span className="kicker mb-6">profile.readme</span>
            <h2 className="section-heading text-black">
              Crafting the future with <span className="text-[var(--signal)]">Code &amp; AI</span>
            </h2>
          </div>
          <p className="border-l-[6px] border-[var(--signal)] pl-5 text-lg font-semibold leading-relaxed text-[#34322d]">
            {subtitle}
          </p>
        </motion.header>

        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <div className="terminal-panel">
              <div className="terminal-bar">
                <span>about.md</span>
                <span>utf-8 / read-only</span>
              </div>
              <div className="space-y-5 p-6 text-base font-medium leading-relaxed text-[var(--paper)] sm:p-8">
                {bios.map((bio, index) => (
                  <p key={bio} className="text-[var(--paper)]">
                    <span className="mr-3 font-mono text-xs font-black text-[var(--signal)]">0{index + 1}</span>
                    {bio}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 border-l-[3px] border-t-[3px] border-black sm:grid-cols-4 lg:grid-cols-2">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className="border-b-[3px] border-r-[3px] border-black bg-[var(--paper)] p-4 sm:p-5"
                >
                  <data className="block text-4xl font-black leading-none text-[var(--signal-dark)]" value={stat.value}>
                    {stat.value}
                  </data>
                  <p className="mt-3 font-mono text-[9px] font-black uppercase leading-snug tracking-[0.08em] text-black sm:text-[10px]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-flow-dense grid-cols-1 border-l-[3px] border-t-[3px] border-black sm:grid-cols-2" data-parallax="-2">
            {highlights.map((item, index) => (
              <motion.article
                key={item.title}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="group min-h-[270px] border-b-[3px] border-r-[3px] border-black bg-[var(--paper)] p-6 transition-colors hover:bg-[var(--signal)] sm:p-7"
                whileHover={{ x: 3, y: 3 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center border-[3px] border-black bg-black text-[var(--paper)] transition-colors group-hover:bg-[var(--paper)] group-hover:text-black">
                    <item.icon size={21} strokeWidth={2.6} />
                  </div>
                  <code className="text-[9px] font-black uppercase tracking-[0.08em] text-black">{item.command}</code>
                </div>
                <h3 className="mt-9 text-xl font-black uppercase leading-tight tracking-[-0.04em] text-black">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[#34322d] group-hover:text-black">{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
