"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Check, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import AsciiSpatialScene from "@/components/AsciiSpatialScene";
import ProjectKnowledgeGraph from "@/components/ProjectKnowledgeGraph";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import type { PortfolioProject } from "@/data/projects";
import styles from "./PortfolioExperience.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

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

const projectSignalPositions = [
  { x: 19, y: 30 },
  { x: 78, y: 25 },
  { x: 83, y: 72 },
  { x: 20, y: 76 },
];

function projectSignal(project: Project) {
  return project.proof[0]?.value || "Live";
}

function TechConstellation({ skills }: { skills: Skill[] }) {
  return (
    <div className={styles.techGalaxy} data-tech-galaxy aria-label="Interactive map of the core technology stack">
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
    <div className={styles.projectObservatory} data-project-observatory aria-label="Map of selected production systems">
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
              key={project.id}
              style={{ "--signal-x": `${position.x}%`, "--signal-y": `${position.y}%`, "--signal-delay": `${index * -0.65}s` } as React.CSSProperties}
            >
              <i aria-hidden="true" />
              <span>{project.title.split(" ").slice(0, 2).join(" ")}</span>
              <strong>{projectSignal(project)}</strong>
            </div>
          );
        })}
        <div className={styles.observatoryVector} aria-hidden="true"><i /><i /><i /><i /></div>
      </div>
      <div className={styles.observatoryFooter}>
        <span>AI / SaaS / Automation / Knowledge</span>
        <span>Scroll vector: horizontal</span>
      </div>
    </div>
  );
}

export default function PortfolioExperience({ settings, projects, projectCount, liveProjectCount, experiences, skills, posts }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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
        const tickerTween = gsap.to(tickerTrack, { xPercent: -50, repeat: -1, duration: 32, ease: "none" });
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
      media.add("(min-width: 900px)", () => {
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
      });

      gsap.utils.toArray<HTMLElement>("[data-experience-card]").forEach((card, index) => {
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
        if (index < experiences.length - 1) {
          gsap.to(card, {
            scale: 0.96,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 18%", end: "bottom top", scrub: 0.7 },
          });
        }
      });

      ScrollTrigger.refresh();
      return () => listenerCleanups.forEach((cleanup) => cleanup());
    },
    { scope: root, dependencies: [homeProjects.length, experiences.length] }
  );

  async function submitContact(event: React.FormEvent) {
    event.preventDefault();
    setFormStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Unable to send");
      setFormStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFormStatus("error");
    }
  }

  const contactEmail = settings.contact_email || "umar@example.com";

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
                <Link href="/work" className={styles.primaryAction}>Explore selected work <i><ArrowUpRight size={16} /></i></Link>
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
              {"I design system that think.".split(" ").map((word, index) => (
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
              <article key={project.id} className={styles.projectPanel}>
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
            <div className={styles.projectOutro}>
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
            <p className={styles.sectionEyebrow}>Engineering notes</p>
            <h2>I document the decisions behind the systems.</h2>
            <Link href="/blog">Browse all writing <ArrowUpRight size={16} /></Link>
          </header>
          <div className={styles.insightGrid}>
            {posts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.insightCard} data-reveal>
                <div><span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span><span>{post.readingTime} min</span></div>
                <span className={styles.insightIndex}>0{index + 1}</span>
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
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              <div>
                <a href={settings.social_github || "#"} target="_blank" rel="noreferrer"><GithubIcon size={18} /> GitHub</a>
                <a href={settings.social_linkedin || "#"} target="_blank" rel="noreferrer"><LinkedinIcon size={18} /> LinkedIn</a>
              </div>
            </div>
            <form onSubmit={submitContact} className={styles.contactForm} data-reveal>
              <div><label htmlFor="name">Name</label><input id="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
              <div><label htmlFor="email">Email</label><input id="email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
              <div className={styles.fullField}><label htmlFor="subject">Subject</label><input id="subject" required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} /></div>
              <div className={styles.fullField}><label htmlFor="message">What are we building?</label><textarea id="message" rows={4} required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></div>
              <button type="submit" disabled={formStatus === "loading"}>{formStatus === "loading" ? "Transmitting" : "Send briefing"}<i><Send size={15} /></i></button>
              {formStatus === "success" && <p role="status" className={styles.success}><Check size={14} /> Message received. I&apos;ll reply within 24 hours.</p>}
              {formStatus === "error" && <p role="alert" className={styles.error}>Transmission failed. Email me directly instead.</p>}
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
