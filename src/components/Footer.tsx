"use client";

import { motion } from "framer-motion";
import { Code2, Heart, Mail, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

type Props = { settings: Record<string, string> };

export default function Footer({ settings }: Props) {
  const socialLinks = [
    { icon: GithubIcon, href: settings.social_github || "#", label: "GitHub" },
    { icon: LinkedinIcon, href: settings.social_linkedin || "#", label: "LinkedIn" },
    { icon: Mail, href: `mailto:${settings.contact_email || ""}`, label: "Email" },
  ];

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Code2 size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                {(settings.hero_name || "Umar").split(" ")[0]}<span className="text-indigo-400">.</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs max-w-xs text-center md:text-left">
              {settings.footer_tagline || "Senior Software Engineer & AI Engineer. Building the future with code and AI."}
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 glass border border-white/8 hover:border-indigo-500/40 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-400 transition-all duration-200"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs flex items-center gap-1.5">
            Built with <Heart size={11} className="text-rose-500 fill-rose-500" /> using Next.js &amp; Tailwind CSS
          </p>
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} {settings.hero_name || "Umar Abdullah"}. All rights reserved.
          </p>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-8 h-8 glass border border-white/8 hover:border-indigo-500/40 rounded-lg flex items-center justify-center text-slate-500 hover:text-indigo-400 transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.1, y: -2 }}
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
