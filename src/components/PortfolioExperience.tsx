"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Check, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import AsciiSpatialScene from "@/components/AsciiSpatialScene";
import ProjectKnowledgeGraph from "@/components/ProjectKnowledgeGraph";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import type { PortfolioProject } from "@/data/projects";
import { publicContactEmail } from "@/lib/contact";
import styles from "./PortfolioExperience.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

// The pinned horizontal project rail and the stacked career cards only run here; the
// matching @media block in PortfolioExperience.module.css lays the rail out sideways.
// Everywhere else (small screens, reduced motion) every section stacks vertically.
const PINNED_MOTION_QUERY = "(min-width: 900px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)";

type ContactField = "name" | "email" | "subject" | "message";
const CONTACT_FIELDS: ContactField[] = ["name", "email", "subject", "message"];

type Project = PortfolioProject;

type Experience = {
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

type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
};

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  publishedAt: Date;
  readingTime: number;
};

type Props = {
  settings: Record<string, string>;
  projects: Project[];
  projectCount: number;
  liveProjectCount: number;
  experiences: Experience[];
  skills: Skill[];
  posts: Post[];
};

const capabilityCopy = [
  {
    key: "AI systems",
    title: "Intelligence that survives production.",
    copy: "Agentic workflows, retrieval systems, evaluations, guardrails, and observability designed as software, not demos.",
    metric: "05 years",
  },
  {
    key: "Architecture",
    title: "Systems engineered for the next order of magnitude.",
    copy: "Event-driven backends, multi-tenant platforms, real-time data, and resilient services with clean operational boundaries.",
    metric: "10 years",
  },
  {
    key: "Automation",
    title: "Complex work reduced to dependable flows.",
    copy: "Distributed queues, browser automation, integrations, and recovery paths that turn fragile manual work into infrastructure.",
    metric: "500K+ pages/day",
  },
  {
    key: "Product",
    title: "Technical depth with a product instinct.",
    copy: "From ambiguous brief to shipped interface: strategy, system design, implementation, instrumentation, and iteration.",
    metric: "30+ shipped",
  },
  {
    key: "Leadership",
    title: "Clarity across code, teams, and decisions.",
    copy: "Architecture direction, pragmatic standards, mentoring, and communication that moves senior teams through complexity.",
    metric: "End-to-end",
  },
];

const ticker = ["Production AI", "Distributed systems", "Agentic workflows", "SaaS architecture", "Automation at scale", "Technical leadership"];

const constellationPositions = [
  { x: 14, y: 27, tier: 2 },
  { x: 33, y: 13, tier: 1 },
  { x: 58, y: 18, tier: 2 },
  { x: 82, y: 29, tier: 3 },
  { x: 25, y: 49, tier: 3 },
  { x: 48, y: 39, tier: 1 },
  { x: 72, y: 49, tier: 2 },
  { x: 90, y: 59, tier: 1 },
  { x: 13, y: 72, tier: 1 },
  { x: 38, y: 76, tier: 2 },
  { x: 63, y: 70, tier: 3 },
  { x: 80, y: 82, tier: 2 },
];

// corner anchors each signal to the box edge on small screens, where centring overflows.
const projectSignalPositions = [
  { x: 19, y: 30, corner: "tl" },
  { x: 78, y: 25, corner: "tr" },
  { x: 83, y: 72, corner: "br" },
  { x: 20, y: 76, corner: "bl" },
];

function TechConstellation({ skills }: { skills: Skill[] }) {
  return (
    <div className={styles.techGalaxy} data-tech-galaxy role="group" aria-label="Map of the core technology stack">
      <div className={styles.galaxyChrome}>
        <span>Technology constellation</span>
        <span>Production stack / live map</span>
      </div>
      <div className={styles.galaxyPlane} data-galaxy-plane>
        <div className={styles.galaxyStars} aria-hidden="true" />
        <div className={`${styles.galaxyOrbit} ${styles.galaxyOrbitOuter}`} aria-hidden="true" />
        <div className={`${styles.galaxyOrbit} ${styles.galaxyOrbitInner}`} aria-hidden="true" />
        <div className={styles.galaxyAxis} aria-hidden="true"><i /><i /></div>
        <div className={styles.galaxyCore}>
          <strong>10Y</strong>
          <span>system<br />depth</span>
        </div>
        {skills.slice(0, constellationPositions.length).map((skill, index) => {
          const position = constellationPositions[index];
          return (
            <span
              key={skill.id}
              className={styles.techNode}
              data-tech-node
              data-tier={position.tier}
              style={{ "--node-x": `${position.x}%`, "--node-y": `${position.y}%`, "--node-delay": `${index * -0.37}s` } as React.CSSProperties}
            >
              <i aria-hidden="true" />
              {skill.name}
            </span>
          );
        })}
      </div>
      <div className={styles.galaxyLegend}>
        <span><i /> Architecture layer</span>
        <span><i /> Intelligence layer</span>
        <span>{skills.length} capabilities mapped</span>
      </div>
    </div>
  );
}

function ProjectObservatory({ projects }: { projects: Project[] }) {
  return (
    <div className={styles.projectObservatory} data-project-observatory role="group" aria-label="Map of selected production systems">
      <div className={styles.observatoryChrome}>
        <span>System telemetry</span>
        <span>{String(projects.length).padStart(2, "0")} cases online</span>
      </div>
      <div className={styles.observatoryField}>
        <div className={styles.observatoryGrid} aria-hidden="true" />
        <div className={styles.observatoryOrbit} data-observatory-orbit aria-hidden="true"><i /><i /><i /></div>
        <div className={styles.observatoryCore}>
          <strong>{String(projects.length).padStart(2, "0")}</strong>
          <span>production<br />systems</span>
        </div>
        {projects.slice(0, projectSignalPositions.length).map((project, index) => {
          const position = projectSignalPositions[index];
          return (
            <div
              className={styles.projectSignal}
              data-project-signal
              data-corner={position.corner}
              key={project.id}
              style={{ "--signal-x": `${position.x}%`, "--signal-y": `${position.y}%`, "--signal-delay": `${index * -0.65}s` } as React.CSSProperties}
            >
              <i aria-hidden="true" />
              <span>{project.title}</span>
              <strong>{project.category}</strong>
            </div>
          );
        })}
        <div className={styles.observatoryVector} aria-hidden="true"><i /><i /><i /><i /></div>
      </div>
      <div className={styles.observatoryFooter}>
        <span>AI / SaaS / Automation / Knowledge</span>
        <span>Scroll to explore</span>
      </div>
    </div>
  );
}

export default function PortfolioExperience({ settings, projects, projectCount, liveProjectCount, experiences, skills, posts }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<Record<ContactField, string>>({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState<{ field?: ContactField; message: string } | null>(null);
  const contactEmail = publicContactEmail(settings);
  const homeProjects = projects
    .filter((project) => project.category !== "Open-source Reference")
    .slice(0, 6);

  const skillGroups = Array.from(
    skills.reduce((map, skill) => {
      const values = map.get(skill.category) || [];
      values.push(skill.name);
      map.set(skill.category, values);
      return map;
    }, new Map<string, string[]>())
  );

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const hero = root.current?.querySelector<HTMLElement>("[data-hero]");
      const scene = root.current?.querySelector<HTMLElement>("[data-scene]");
      if (hero && scene) {
        const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
        intro
          .from("[data-hero-line]", { opacity: 0.28, y: 38, rotate: 1.2, duration: 0.82, stagger: 0.06 }, 0)
          .from("[data-hero-fade]", { opacity: 0.36, y: 14, duration: 0.68, stagger: 0.045 }, 0.04)
          .from("[data-visual-shell]", { opacity: 0.24, scale: 0.94, rotateY: -4, duration: 0.92 }, 0.02);

        gsap.to(scene, {
          yPercent: 24,
          scale: 1.18,
          rotate: 7,
          opacity: 0.28,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 },
        });

        gsap.to("[data-hero-copy]", {
          y: -72,
          opacity: 0.18,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "28% top", end: "bottom top", scrub: 0.75 },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((layer) => {
        const depth = Number(layer.dataset.depth || 10);
        gsap.to(layer, {
          yPercent: depth,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.65 },
        });
      });

      const thesisWords = gsap.utils.toArray<HTMLElement>("[data-thesis-word]");
      if (thesisWords.length) {
        gsap.fromTo(
          thesisWords,
          { opacity: 0.1, y: 28 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: { trigger: "[data-thesis]", start: "top 55%", end: "bottom 70%", scrub: 0.8 },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 64, filter: "blur(12px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          }
        );
      });

      const galaxy = root.current?.querySelector<HTMLElement>("[data-tech-galaxy]");
      const galaxyPlane = galaxy?.querySelector<HTMLElement>("[data-galaxy-plane]");
      const listenerCleanups: Array<() => void> = [];
      if (galaxy && galaxyPlane) {
        gsap.fromTo(
          galaxy,
          { opacity: 0, scale: 0.84, rotateZ: -4 },
          {
            opacity: 1,
            scale: 1,
            rotateZ: 0,
            duration: 1.25,
            ease: "power3.out",
            scrollTrigger: { trigger: galaxy, start: "top 88%", once: true },
          }
        );
        gsap.from("[data-tech-node]", {
          opacity: 0,
          scale: 0.4,
          stagger: 0.045,
          duration: 0.7,
          ease: "back.out(1.8)",
          scrollTrigger: { trigger: galaxy, start: "top 78%", once: true },
        });

        if (window.matchMedia("(pointer: fine)").matches) {
          const rotateX = gsap.quickTo(galaxyPlane, "rotationX", { duration: 0.65, ease: "power3.out" });
          const rotateY = gsap.quickTo(galaxyPlane, "rotationY", { duration: 0.65, ease: "power3.out" });
          const onPointerMove = (event: PointerEvent) => {
            const bounds = galaxy.getBoundingClientRect();
            rotateX(((event.clientY - bounds.top) / bounds.height - 0.5) * -7);
            rotateY(((event.clientX - bounds.left) / bounds.width - 0.5) * 9);
          };
          const onPointerLeave = () => {
            rotateX(0);
            rotateY(0);
          };
          galaxy.addEventListener("pointermove", onPointerMove);
          galaxy.addEventListener("pointerleave", onPointerLeave);
          listenerCleanups.push(() => {
            galaxy.removeEventListener("pointermove", onPointerMove);
            galaxy.removeEventListener("pointerleave", onPointerLeave);
          });
        }
      }

      const tickerTrack = root.current?.querySelector<HTMLElement>("[data-ticker-track]");
      if (tickerTrack) {
        const tickerTween = gsap.to(tickerTrack, { xPercent: -50, repeat: -1, duration: 32, ease: "none", paused: true });
        // The marquee only moves while it is on screen.
        ScrollTrigger.create({
          trigger: tickerTrack,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? tickerTween.play() : tickerTween.pause()),
        });
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate(self) {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 900, 3.5);
            gsap.to(tickerTween, { timeScale: self.direction * boost, duration: 0.15, overwrite: true });
            gsap.to(tickerTween, { timeScale: self.direction, duration: 1.2, delay: 0.12, overwrite: true });
          },
        });
      }

      const media = gsap.matchMedia();
      media.add(PINNED_MOTION_QUERY, () => {
        const cleanups: Array<() => void> = [];
        const rail = root.current?.querySelector<HTMLElement>("[data-project-rail]");
        const stage = root.current?.querySelector<HTMLElement>("[data-project-stage]");
        if (rail && stage) {
          const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth);
          const railTween = gsap.to(rail, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: () => `+=${distance() + window.innerHeight * 0.9}`,
              pin: true,
              scrub: 0.85,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          // Keyboard focus on an off-screen panel moves the page to the scroll position
          // that slides that panel into view, instead of leaving it behind the clip.
          const onFocusIn = (event: FocusEvent) => {
            const item = (event.target as HTMLElement).closest<HTMLElement>("[data-rail-item]");
            const trigger = railTween.scrollTrigger;
            const max = distance();
            if (!item || !trigger || !max) return;
            const offset = gsap.utils.clamp(0, max, item.offsetLeft - (window.innerWidth - item.offsetWidth) / 2);
            const top = trigger.start + (offset / max) * (trigger.end - trigger.start);
            window.requestAnimationFrame(() => window.scrollTo({ top, behavior: "instant" }));
          };
          stage.addEventListener("focusin", onFocusIn);
          cleanups.push(() => stage.removeEventListener("focusin", onFocusIn));

          gsap.utils.toArray<HTMLElement>("[data-project-visual]").forEach((visual) => {
            gsap.fromTo(
              visual,
              { scale: 0.78, rotateY: -22, opacity: 0.35 },
              {
                scale: 1,
                rotateY: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: visual,
                  containerAnimation: railTween,
                  start: "left 90%",
                  end: "center center",
                  scrub: true,
                },
              }
            );
          });

          const observatory = root.current?.querySelector<HTMLElement>("[data-project-observatory]");
          const observatoryOrbit = root.current?.querySelector<HTMLElement>("[data-observatory-orbit]");
          if (observatory) {
            gsap.fromTo(
              observatory,
              { opacity: 0.84, scale: 0.92, rotateZ: -2.5 },
              {
                opacity: 1,
                scale: 1,
                rotateZ: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: stage,
                  start: "top top",
                  end: () => `+=${Math.max(window.innerWidth * 0.85, 900)}`,
                  scrub: 0.8,
                },
              }
            );
          }
          if (observatoryOrbit) {
            gsap.to(observatoryOrbit, {
              rotateZ: 110,
              ease: "none",
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: () => `+=${Math.max(window.innerWidth * 1.15, 1100)}`,
                scrub: 1,
              },
            });
          }
        }

        const careerSection = root.current?.querySelector<HTMLElement>("[data-career-section]");
        const careerHeading = root.current?.querySelector<HTMLElement>("[data-career-heading]");
        if (careerSection && careerHeading) {
          ScrollTrigger.create({
            trigger: careerHeading,
            start: "top 116px",
            endTrigger: careerSection,
            end: "bottom bottom",
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });
        }

        // Cards stack on top of each other here, so a card dims only once the next one
        // covers it. On small screens the cards scroll normally and stay fully opaque.
        gsap.utils.toArray<HTMLElement>("[data-experience-card]").forEach((card, index, cards) => {
          gsap.fromTo(
            card,
            { opacity: 0.16, y: 90, rotateX: 10 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top 92%", end: "top 48%", scrub: 0.6 },
            }
          );
          if (index < cards.length - 1) {
            gsap.to(card, {
              scale: 0.96,
              opacity: 0.35,
              ease: "none",
              scrollTrigger: { trigger: cards[index + 1], start: "top 70%", end: "top 20%", scrub: 0.7 },
            });
          }
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      });

      ScrollTrigger.refresh();
      return () => listenerCleanups.forEach((cleanup) => cleanup());
    },
    { scope: root, dependencies: [homeProjects.length, experiences.length] }
  );

  // Decorative CSS loops (pulses, orbits, floating nodes) pause while their section is off screen.
  useEffect(() => {
    const sections = root.current?.querySelectorAll<HTMLElement>("main section");
    if (!sections?.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting)),
      { rootMargin: "200px 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // A field error moves focus to the field, which then announces the message it describes.
  useEffect(() => {
    if (formError?.field) document.getElementById(formError.field)?.focus();
  }, [formError]);

  function updateField(field: ContactField, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (formError?.field === field) setFormError(null);
  }

  function fieldProps(field: ContactField) {
    const invalid = formError?.field === field;
    return {
      id: field,
      name: field,
      value: form[field],
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateField(field, event.target.value),
      "aria-invalid": invalid || undefined,
      "aria-describedby": invalid ? `${field}-error` : undefined,
    };
  }

  function fieldError(field: ContactField) {
    return formError?.field === field ? <p id={`${field}-error`} className={styles.fieldError}>{formError.message}</p> : null;
  }

  async function submitContact(event: React.FormEvent) {
    event.preventDefault();
    setFormStatus("loading");
    setFormError(null);
    const fallback = contactEmail ? ` You can also email ${contactEmail}.` : "";
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const field = CONTACT_FIELDS.find((name) => name === payload.field);
        const serverMessage = typeof payload.error === "string" ? payload.error : "";
        setFormStatus("error");
        if (field && serverMessage) setFormError({ field, message: serverMessage });
        else if (response.status === 429 && serverMessage) setFormError({ message: `${serverMessage}${fallback}` });
        else setFormError({ message: `Unable to send your message right now. Try again in a few minutes.${fallback}` });
        return;
      }
      setFormStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFormStatus("error");
      setFormError({ message: `Unable to send your message. Check your connection and try again.${fallback}` });
    }
  }

  const linkedinUrl = settings.social_linkedin;
  const githubUrl = settings.social_github;

  return (
    <div ref={root} className={styles.experience}>
      <Navbar />

      <main id="main-content">
        <section className={styles.hero} data-hero>
          <div className={styles.heroAura} data-depth="-16" />
          <div className={styles.heroGrid} data-depth="9" />

          <div className={styles.heroShell}>
            <div className={styles.heroCopy} data-hero-copy>
              <div className={styles.heroTopline} data-hero-fade>
                <div className={styles.heroAvailability}>
                  <i aria-hidden="true" /> Available for select collaborations
                </div>
                <span>PK / UTC+05</span>
              </div>
              <p className={styles.heroEyebrow} data-hero-fade>Umar Abdullah / Senior Software + AI Engineer</p>
              <h1 className={styles.heroTitle} aria-label="Built for scale. Wired to think.">
                <span className={styles.heroLine} data-line-index="01">
                  <i data-hero-line>Built for scale.</i>
                  <b aria-hidden="true">10Y / SOFTWARE</b>
                </span>
                <span className={`${styles.heroLine} ${styles.heroAccent}`} data-line-index="02">
                  <i data-hero-line>Wired to think.</i>
                  <b aria-hidden="true">05Y / AI</b>
                </span>
              </h1>
              <p className={styles.heroLead} data-hero-fade>
                Ten years engineering scalable software. Five years shipping production AI—agents, retrieval, automation, and platforms built for real-world load.
              </p>
              <div className={styles.heroActions} data-hero-fade>
                <Link href="/work" className={styles.primaryAction}>Explore the work <i><ArrowUpRight size={16} /></i></Link>
                <a href="#expertise" className={styles.secondaryAction}>Explore capabilities</a>
              </div>
            </div>

            <div className={styles.heroVisual} data-visual-shell>
              <div className={styles.asciiMeta} data-hero-fade aria-hidden="true">
                <span>ASCII / 3D</span>
                <strong>Topology_01</strong>
              </div>
              <div className={styles.scene} data-scene aria-hidden="true">
                <AsciiSpatialScene className={styles.asciiScene} />
              </div>
              <div className={styles.asciiAxis} aria-hidden="true"><i /><i /></div>
              <div className={styles.visualReadout} data-depth="-5">
                <span>Live spatial model</span>
                <strong>Production intelligence</strong>
                <small>Agents / RAG / Automation</small>
              </div>
              <div className={styles.visualPulse} data-depth="7">
                <i aria-hidden="true" /> System active
              </div>
              <div className={styles.visualCoordinates} aria-hidden="true">X 10.00<br />Y 05.00<br />Z ∞</div>
            </div>
          </div>

          <div className={styles.heroProof} data-hero-fade>
            <div><data value="10">10</data><span>Years<br /><strong>software engineering</strong></span></div>
            <div><data value="5">05</data><span>Years<br /><strong>AI engineering</strong></span></div>
            <div className={styles.heroProofFocus}><span>Operating range</span><strong>Architecture → production → scale</strong></div>
            <div className={styles.heroProofSignal}><i aria-hidden="true" /><span>Systems online<br /><strong>Open to complex work</strong></span></div>
          </div>
        </section>

        <section id="about" className={styles.thesisSection} data-thesis>
          <div className={styles.thesisSticky}>
            <p className={styles.sectionEyebrow}>A decade of engineering judgment</p>
            <h2 className={styles.thesisTitle}>
              {"I design systems that think.".split(" ").map((word, index) => (
                <span key={`${word}-${index}`} data-thesis-word>{word}&nbsp;</span>
              ))}
            </h2>
            <div className={styles.careerTracks}>
              <article>
                <data value="10">10</data>
                <div><strong>Years</strong><span>Software engineering</span></div>
                <p>Deep foundations in architecture, full-stack products, distributed systems, automation, and technical leadership.</p>
              </article>
              <article>
                <data value="5">05</data>
                <div><strong>Years</strong><span>AI engineering</span></div>
                <p>Focused practice turning LLMs, agents, retrieval, and intelligent workflows into observable production systems.</p>
              </article>
            </div>
          </div>
        </section>

        <div className={styles.ticker} aria-hidden="true">
          <div data-ticker-track>{[...ticker, ...ticker].map((item, index) => <span key={`${item}-${index}`}>{item}<i>✦</i></span>)}</div>
        </div>

        <section id="expertise" className={styles.capabilities}>
          <header className={styles.capabilityIntro}>
            <TechConstellation skills={skills} />
            <div className={styles.capabilityStatement} data-reveal>
              <p className={styles.sectionEyebrow}>Capability architecture</p>
              <h2>Senior depth across the entire system.</h2>
              <p>Not a collection of tools. A practiced ability to move from ambiguity to architecture to reliable output.</p>
            </div>
          </header>
          <div className={styles.capabilityGrid}>
            {capabilityCopy.map((capability, index) => (
              <article key={capability.key} className={styles[`capability${index + 1}`]} data-reveal>
                <div><span>{capability.key}</span><small>{capability.metric}</small></div>
                <h3>{capability.title}</h3>
                <p>{capability.copy}</p>
                {index === 0 && <div className={styles.signalDiagram} aria-hidden="true"><i /><i /><i /><i /><b /></div>}
              </article>
            ))}
          </div>
          <div className={styles.skillMatrix} data-reveal>
            {skillGroups.map(([category, values]) => (
              <div key={category}><strong>{category}</strong><p>{values.join(" / ")}</p></div>
            ))}
          </div>
        </section>

        <section id="projects" className={styles.projectStage} data-project-stage>
          <div className={styles.projectRail} data-project-rail>
            <header className={styles.projectIntro}>
              <div className={styles.projectIntroCopy}>
                <p className={styles.sectionEyebrow}>Selected systems</p>
                <h2>Proof over promises.</h2>
                <p>Six selected production systems. The full archive contains {projectCount} reviewed projects, including {liveProjectCount} verified live deployments.</p>
                <div className={styles.railHint}><span /> Architecture / intelligence / operations</div>
              </div>
              <ProjectObservatory projects={homeProjects} />
            </header>
            {homeProjects.map((project, index) => (
              <article key={project.id} className={styles.projectPanel} data-rail-item>
                <div className={styles.projectMeta}>
                  <span>{String(index + 1).padStart(2, "0")} / {String(homeProjects.length).padStart(2, "0")}</span>
                  <span>{project.featured ? "Featured system" : "Selected build"}</span>
                </div>
                <div className={styles.projectVisual} data-project-visual>
                  <ProjectKnowledgeGraph project={project} compact />
                </div>
                <div className={styles.projectCopy}>
                  <h3>{project.title}</h3>
                  <p>{project.shortDescription}</p>
                  <div className={styles.techList}>{project.techStack.slice(0, 8).map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <Link href={`/work/${project.slug}`}>Open case study <i><ArrowUpRight size={15} /></i></Link>
                </div>
              </article>
            ))}
            <div className={styles.projectOutro} data-rail-item>
              <p>There is more beneath the surface.</p>
              <Link href="/work">View the complete work archive <ArrowUpRight size={18} /></Link>
            </div>
          </div>
        </section>

        <section id="experience" className={styles.careerSection} data-career-section>
          <div className={styles.careerHeading} data-career-heading>
            <p className={styles.sectionEyebrow}>Career signal</p>
            <h2>Built through real constraints.</h2>
            <p>Each role added a new layer: delivery, scale, architecture, intelligence, and leadership.</p>
            <div className={styles.careerIndex}><span>10Y</span><i /><span>05Y AI</span></div>
          </div>
          <div className={styles.careerCards}>
            {experiences.length === 0 && (
              <div className={styles.careerEmpty}>
                <h3>{linkedinUrl ? "Full role history is on LinkedIn." : "Ask for the full role history."}</h3>
                {linkedinUrl ? (
                  <a href={linkedinUrl} target="_blank" rel="noreferrer">Open the LinkedIn profile <ArrowUpRight size={16} aria-hidden="true" /></a>
                ) : (
                  <a href="#contact">Get in touch <ArrowUpRight size={16} aria-hidden="true" /></a>
                )}
              </div>
            )}
            {experiences.map((item, index) => (
              <article key={item.id} data-experience-card>
                <div className={styles.careerCardTop}>
                  <span>{item.period}</span><span>{item.location || "Worldwide"}</span>
                </div>
                <div className={styles.careerCardBody}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{item.role}</h3><strong>{item.company}</strong><p>{item.description}</p></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="blog" className={styles.insights}>
          <header data-reveal>
            <p className={styles.sectionEyebrow}>Journal</p>
            <h2>I document the decisions behind the systems.</h2>
            <Link href="/blog">Read the journal <ArrowUpRight size={16} /></Link>
          </header>
          <div className={styles.insightGrid}>
            {posts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.insightCard} data-reveal>
                <div><span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span><span>{post.readingTime} min</span></div>
                <span className={styles.insightIndex} aria-hidden="true">0{index + 1}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <small>{post.tags.slice(0, 3).join(" / ")}</small>
              </Link>
            ))}
          </div>
        </section>

        <section id="contact" className={styles.contact}>
          <div className={styles.contactGlow} aria-hidden="true" />
          <header data-reveal>
            <p className={styles.sectionEyebrow}>Open channel</p>
            <h2>Let&apos;s build what does not exist yet.</h2>
            <p>For senior engineering roles, AI product architecture, and ambitious systems that need both depth and momentum.</p>
          </header>
          <div className={styles.contactGrid}>
            <div className={styles.contactDirect} data-reveal>
              <span>Prefer a direct line?</span>
              {contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : <p>Send a message with the form, or reach out on a profile below.</p>}
              {(githubUrl || linkedinUrl) && (
                <div>
                  {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer"><GithubIcon size={18} /> GitHub</a>}
                  {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noreferrer"><LinkedinIcon size={18} /> LinkedIn</a>}
                </div>
              )}
              <Link href="/about#contact" className={styles.contactAll}>All contact details <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
            <form onSubmit={submitContact} className={styles.contactForm} data-reveal>
              <div><label htmlFor="name">Name</label><input {...fieldProps("name")} required autoComplete="name" maxLength={200} />{fieldError("name")}</div>
              <div><label htmlFor="email">Email</label><input {...fieldProps("email")} type="email" required autoComplete="email" maxLength={254} />{fieldError("email")}</div>
              <div className={styles.fullField}><label htmlFor="subject">Subject</label><input {...fieldProps("subject")} required maxLength={500} />{fieldError("subject")}</div>
              <div className={styles.fullField}><label htmlFor="message">What are we building?</label><textarea {...fieldProps("message")} rows={4} required maxLength={5000} />{fieldError("message")}</div>
              <button type="submit" disabled={formStatus === "loading"}>{formStatus === "loading" ? "Transmitting" : "Send briefing"}<i><Send size={15} /></i></button>
              {formStatus === "success" && <p role="status" className={styles.success}><Check size={14} /> Message received. I&apos;ll reply within 24 hours.</p>}
              {formStatus === "error" && formError && !formError.field && <p role="alert" className={styles.error}>{formError.message}</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div><strong>Umar Abdullah</strong><span>Software × Intelligence</span></div>
        <div><Link href="/work">Work</Link><Link href="/blog">Journal</Link><Link href="/docs">API</Link></div>
        <p>© {new Date().getFullYear()} / Built with Next.js, GSAP &amp; WebGL</p>
      </footer>
    </div>
  );
}
