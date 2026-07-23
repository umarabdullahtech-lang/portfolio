"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle, Mail, MessageSquare, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Status = "idle" | "loading" | "success" | "error";
type Props = { settings: Record<string, string> };

export default function Contact({ settings }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: settings.contact_email || "umar@example.com",
      href: `mailto:${settings.contact_email || "umar@example.com"}`,
    },
    {
      icon: GithubIcon,
      label: "GitHub",
      value: (settings.social_github || "https://github.com/umarabdullahtech").replace(/^https?:\/\//, ""),
      href: settings.social_github || "https://github.com/umarabdullahtech",
    },
    {
      icon: LinkedinIcon,
      label: "LinkedIn",
      value: (settings.social_linkedin || "https://linkedin.com/in/umarabdullahtech").replace(/^https?:\/\//, ""),
      href: settings.social_linkedin || "https://linkedin.com/in/umarabdullahtech",
    },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const inputClass =
    "w-full border-[3px] border-black bg-[var(--paper)] px-4 py-3 font-mono text-sm font-semibold text-black outline-none transition-[box-shadow,transform] placeholder:text-[#777268] focus:-translate-x-1 focus:-translate-y-1 focus:shadow-[6px_6px_0_#ff3b19]";

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden border-t-[3px] border-black px-5 py-28 sm:px-8 md:py-40 lg:px-10">
      <div className="pointer-events-none absolute inset-0 blueprint-grid" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 border-b-[3px] border-black pb-10"
        >
          <span className="kicker mb-6">channel.open --direct</span>
          <h2 className="section-heading max-w-6xl text-black">
            Let&apos;s <span className="text-[var(--signal)]">Work Together</span>
          </h2>
          <p className="mt-7 max-w-2xl text-lg font-semibold leading-relaxed text-[#34322d]">
            Have a project in mind or want to discuss an opportunity? I&apos;d love to hear from you.
          </p>
        </motion.header>

        <div className="grid gap-10 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="lg:col-span-2"
          >
            <div className="terminal-panel">
              <div className="terminal-bar">
                <span>availability.status</span>
                <span>open</span>
              </div>
              <div className="p-6 sm:p-7">
                <MessageSquare size={30} strokeWidth={2.4} className="text-[var(--signal)]" />
                <h3 className="mt-6 text-3xl font-black uppercase tracking-[-0.045em] text-[var(--paper)]">Get in touch</h3>
                <p className="mt-4 text-sm font-medium leading-relaxed text-[#b7b1a5]">
                  Whether you need an AI engineer, a full-stack developer, or a technical partner to bring your product to life, let&apos;s talk. I typically respond within 24 hours.
                </p>
                <div className="mt-8 border-t-2 border-[var(--paper)] pt-5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#b7b1a5]">
                  <p><span className="text-[var(--signal)]">response_sla:</span> &lt; 24h</p>
                  <p className="mt-2"><span className="text-[var(--signal)]">channel:</span> email / secure form</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.18 + index * 0.07, duration: 0.4 }}
                  className="hard-press flex items-center gap-4 border-[3px] border-black bg-[var(--paper)] p-4 text-black shadow-[6px_6px_0_#0a0a0a]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-black bg-[var(--signal)]">
                    <info.icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[9px] font-black uppercase tracking-wider text-[var(--signal-dark)]">{info.label}</span>
                    <span className="block truncate text-sm font-extrabold">{info.value}</span>
                  </span>
                  <ArrowUpRight size={17} strokeWidth={3} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="border-[3px] border-black bg-[var(--paper-deep)] p-5 shadow-[10px_10px_0_#0a0a0a] sm:p-8">
              <div className="mb-8 flex items-center justify-between border-b-[3px] border-black pb-4 font-mono text-[10px] font-black uppercase tracking-[0.1em]">
                <span>message.compose</span>
                <span>all fields required</span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Name" id="name">
                  <input id="name" name="name" type="text" required placeholder="John Doe" value={form.name} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Email" id="email">
                  <input id="email" name="email" type="email" required placeholder="john@example.com" value={form.email} onChange={handleChange} className={inputClass} />
                </Field>
              </div>
              <div className="mt-6">
                <Field label="Subject" id="subject">
                  <input id="subject" name="subject" type="text" required placeholder="Project idea or opportunity" value={form.subject} onChange={handleChange} className={inputClass} />
                </Field>
              </div>
              <div className="mt-6">
                <Field label="Message" id="message">
                  <textarea id="message" name="message" required rows={6} placeholder="Tell me about your project, goals, and timeline..." value={form.message} onChange={handleChange} className={`${inputClass} resize-none`} />
                </Field>
              </div>

              {status === "success" && (
                <div role="status" className="mt-6 flex items-center gap-3 border-[3px] border-black bg-[#a8ff78] p-4 font-mono text-xs font-black uppercase text-black">
                  <CheckCircle size={17} /> Message sent. I&apos;ll get back to you within 24 hours.
                </div>
              )}
              {status === "error" && (
                <div role="alert" className="mt-6 flex items-center gap-3 border-[3px] border-black bg-[var(--signal)] p-4 font-mono text-xs font-black uppercase text-black">
                  <AlertCircle size={17} /> Something went wrong. Please try again or email me directly.
                </div>
              )}

              <button type="submit" disabled={status === "loading"} className="hard-button mt-8 w-full py-4 disabled:cursor-wait disabled:opacity-60">
                {status === "loading" ? "Transmitting..." : "Transmit message"}
                <Send size={16} strokeWidth={3} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[10px] font-black uppercase tracking-[0.1em] text-black">
        {label} <span className="text-[var(--signal-dark)]">*</span>
      </label>
      {children}
    </div>
  );
}
