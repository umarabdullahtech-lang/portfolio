"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check, Mail, Terminal } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

const marqueeItems = [
  "AI Engineer",
  "Software Architect",
  "Node.js Expert",
  "SaaS Builder",
  "LangChain",
  "RAG Systems",
  "Automation",
  "Production AI",
];

type Props = { settings: Record<string, string> };

export default function Hero({ settings }: Props) {
  const socialLinks = [
    { icon: GithubIcon, href: settings.social_github || "#", label: "GitHub" },
    { icon: LinkedinIcon, href: settings.social_linkedin || "#", label: "LinkedIn" },
    { icon: Mail, href: `mailto:${settings.contact_email || ""}`, label: "Email" },
  ];

  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden border-b-[3px] border-black pt-[72px]">
      <div className="pointer-events-none absolute inset-0 blueprint-grid" aria-hidden="true" />
      <div className="register-mark left-5 top-24 md:left-10" aria-hidden="true" />
      <div className="register-mark bottom-20 right-5 md:right-10" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-20">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="kicker mb-8"
          >
            <span className="h-2.5 w-2.5 border-2 border-black bg-[var(--signal)]" />
            {settings.hero_badge || "Available for new opportunities"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="max-w-6xl text-[clamp(4rem,8.4vw,8.8rem)] font-black uppercase leading-[0.78] tracking-[-0.075em] text-black"
          >
            Hi, I&apos;m <span className="text-[var(--signal)]">{settings.hero_name || "Umar Abdullah"}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-8 flex max-w-3xl items-start gap-3 border-l-[6px] border-black pl-4"
          >
            <Terminal className="mt-1 shrink-0 text-[var(--signal-dark)]" size={20} strokeWidth={3} />
            <p className="font-mono text-sm font-extrabold uppercase leading-relaxed tracking-[-0.02em] text-black sm:text-base">
              {settings.hero_title || "Senior Software Engineer & AI Engineer"}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-7 max-w-2xl text-base font-medium leading-relaxed text-[#34322d] sm:text-lg"
          >
            {settings.hero_description ||
              "I build AI-powered automation systems and scalable SaaS platforms that solve real-world problems."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mt-9 flex flex-col gap-4 sm:flex-row"
          >
            <button onClick={() => handleScroll("#projects")} className="hard-button px-7 py-4">
              Execute: view work
              <ArrowUpRight size={16} strokeWidth={3} />
            </button>
            <button onClick={() => handleScroll("#contact")} className="hard-button hard-button--dark px-7 py-4">
              Open channel
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <span className="mr-1 font-mono text-[10px] font-black uppercase tracking-[0.12em]">Connect //</span>
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hard-press flex h-11 min-w-11 items-center justify-center gap-2 border-[3px] border-black bg-[var(--paper)] px-3 font-mono text-[10px] font-black uppercase text-black shadow-[4px_4px_0_#0a0a0a]"
              >
                <Icon size={17} />
                <span className="hidden sm:inline">{label}</span>
              </a>
            ))}
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 35, rotate: 0 }}
          animate={{ opacity: 1, x: 0, rotate: -1.2 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="terminal-panel relative lg:col-span-5 lg:ml-5"
          data-parallax="-5"
          aria-label="Career experience summary"
        >
          <div className="terminal-bar">
            <span>career.kernel / verified</span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 border-2 border-black bg-[#f3efe4]" /> online
            </span>
          </div>
          <div className="p-5 font-mono sm:p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[#b7b1a5]">$ career --timeline --depth</p>
            <div className="mt-5 border-y-2 border-[#f3efe4]">
              <div className="grid grid-cols-[1fr_auto] items-end gap-4 border-b-2 border-[#f3efe4] py-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b7b1a5]">Core discipline</p>
                  <p className="mt-1 text-sm font-black uppercase text-[var(--paper)]">Software engineering</p>
                </div>
                <data value="10" className="text-6xl font-black leading-none text-[var(--signal)] sm:text-7xl">
                  10Y
                </data>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-end gap-4 py-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b7b1a5]">Specialized track</p>
                  <p className="mt-1 text-sm font-black uppercase text-[var(--paper)]">AI engineering</p>
                </div>
                <data value="5" className="text-6xl font-black leading-none text-[var(--signal)] sm:text-7xl">
                  05Y
                </data>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-xs uppercase tracking-wide">
              {["Production systems", "AI agents + RAG", "Scalable SaaS platforms"].map((line) => (
                <div key={line} className="flex items-center gap-3 text-[var(--paper)]">
                  <Check size={15} strokeWidth={3} className="text-[var(--signal)]" />
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <p className="mt-7 border-l-4 border-[var(--signal)] pl-3 text-[10px] uppercase leading-relaxed tracking-[0.1em] text-[#b7b1a5]">
              A decade of systems thinking. Five years turning machine intelligence into reliable software.
            </p>
          </div>
        </motion.aside>
      </div>

      <button
        onClick={() => handleScroll("#about")}
        className="absolute bottom-20 right-5 hidden h-12 w-12 items-center justify-center border-[3px] border-black bg-[var(--paper)] text-black shadow-[4px_4px_0_#0a0a0a] transition-transform hover:translate-y-1 lg:flex"
        aria-label="Scroll to about"
      >
        <ArrowDown size={20} strokeWidth={3} />
      </button>

      <div className="marquee relative" aria-label="Areas of expertise">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span className="marquee-item" key={`${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
