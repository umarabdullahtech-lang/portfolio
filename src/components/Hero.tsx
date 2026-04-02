"use client";

import { motion } from "framer-motion";
import { ArrowDown, Mail, Sparkles, Terminal } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

const socialLinks = [
  { icon: GithubIcon, href: "https://github.com/umarabdullahtech", label: "GitHub" },
  { icon: LinkedinIcon, href: "https://linkedin.com/in/umarabdullahtech", label: "LinkedIn" },
  { icon: Mail, href: "mailto:umar@example.com", label: "Email" },
];

const floatingBadges = [
  { label: "AI Engineer", delay: 0, x: -200, y: -80 },
  { label: "Node.js Expert", delay: 0.2, x: 200, y: -60 },
  { label: "SaaS Builder", delay: 0.4, x: -180, y: 100 },
  { label: "LangChain", delay: 0.6, x: 190, y: 110 },
];

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Radial gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] rounded-full bg-cyan-600/6 blur-[100px]" />
      </div>

      {/* Floating badges — desktop only */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {floatingBadges.map((badge) => (
          <motion.div
            key={badge.label}
            className="absolute top-1/2 left-1/2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 1, 1, 0.8],
              scale: 1,
              x: badge.x,
              y: badge.y,
            }}
            transition={{
              delay: badge.delay + 1.2,
              duration: 0.6,
              opacity: { duration: 1 },
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3 + badge.delay, repeat: Infinity, ease: "easeInOut" }}
              className="glass rounded-full px-3 py-1.5 text-xs font-medium text-indigo-300 border border-indigo-500/20 shadow-lg shadow-indigo-500/10 whitespace-nowrap"
            >
              {badge.label}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/20 text-sm text-indigo-300 mb-8"
        >
          <Sparkles size={14} className="text-indigo-400" />
          Available for new opportunities
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-4 leading-tight tracking-tight"
        >
          Hi, I&apos;m{" "}
          <span className="gradient-text">Umar Abdullah</span>
        </motion.h1>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <Terminal size={20} className="text-indigo-400" />
          <p className="text-xl sm:text-2xl font-semibold text-slate-300">
            Senior Software Engineer &amp; AI Engineer
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          I build{" "}
          <span className="text-indigo-300 font-medium">AI-powered automation systems</span> and
          scalable{" "}
          <span className="text-violet-300 font-medium">SaaS platforms</span> that solve
          real-world problems. From LLM pipelines to full-stack applications — I turn complex
          ideas into production-ready software.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.button
            onClick={() => handleScroll("#projects")}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30 cursor-pointer w-full sm:w-auto"
            whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(99,102,241,0.35)" }}
            whileTap={{ scale: 0.97 }}
          >
            View My Work
          </motion.button>
          <motion.button
            onClick={() => handleScroll("#contact")}
            className="px-8 py-3.5 glass border border-white/10 hover:border-indigo-500/40 text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer w-full sm:w-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Get In Touch
          </motion.button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 glass border border-white/10 hover:border-indigo-500/40 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all duration-200"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => handleScroll("#about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Scroll down"
      >
        <ArrowDown size={22} />
      </motion.button>
    </section>
  );
}
