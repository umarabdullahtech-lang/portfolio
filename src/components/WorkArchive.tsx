"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SpatialScene from "@/components/SpatialScene";
import ProjectKnowledgeGraph from "@/components/ProjectKnowledgeGraph";
import type { PortfolioProject } from "@/data/projects";
import styles from "./WorkArchive.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

export type ArchiveProject = PortfolioProject;

type Props = {
  projects: ArchiveProject[];
  settings: Record<string, string>;
};

export default function WorkArchive({ projects, settings }: Props) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      gsap.from("[data-work-title] > span", {
        yPercent: 120,
        rotate: 3,
        stagger: 0.08,
        duration: 1.25,
        ease: "power4.out",
      });

      gsap.to("[data-work-scene]", {
        yPercent: 30,
        scale: 0.82,
        opacity: 0.22,
        ease: "none",
        scrollTrigger: { trigger: "[data-work-hero]", start: "top top", end: "bottom top", scrub: 0.8 },
      });

      gsap.utils.toArray<HTMLElement>("[data-work-item]").forEach((item) => {
        const visual = item.querySelector<HTMLElement>("[data-work-visual]");
        gsap.from(item, {
          opacity: 0,
          y: 90,
          filter: "blur(12px)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 86%", once: true },
        });
        if (visual) {
          gsap.fromTo(
            visual,
            { yPercent: -8, rotateZ: -3 },
            { yPercent: 8, rotateZ: 3, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: 0.7 } }
          );
        }
      });
    },
    { scope }
  );

  return (
    <div className={styles.page} ref={scope}>
      <Navbar />
      <main id="main-content">
        <section className={styles.hero} data-work-hero>
          <div className={styles.scene} data-work-scene aria-hidden="true">
            <SpatialScene />
          </div>
          <div className={styles.heroGrid} aria-hidden="true" />
          <p className={styles.eyebrow}>Live production systems</p>
          <h1 data-work-title>
            <span>Evidence in</span>
            <span>production.</span>
          </h1>
          <div className={styles.heroBottom}>
            <p>
              {projects.length} reachable systems spanning decision intelligence, AI platforms, retrieval, commerce, and transparent open-source references.
            </p>
            <Link href={`/work/${projects[0]?.slug || "jhb-property-intelligence"}`}>
              Start with the flagship <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className={styles.index} id="case-index" aria-label="Selected project case studies">
          <header>
            <p>Live case index</p>
            <p>AI / Software / Platforms</p>
            <p>{projects.length} reachable systems</p>
          </header>

          <div className={styles.projectList}>
            {projects.map((project) => (
              <article className={styles.project} data-work-item key={project.id}>
                <div className={styles.projectMeta}>
                  <span>{project.category}</span>
                  <strong>{project.role}</strong>
                  <data>{project.proof[0]?.value || "Live"} / {project.proof[0]?.label || "deployed"}</data>
                </div>

                <Link href={`/work/${project.slug}`} className={styles.visualLink} aria-label={`View ${project.title} case study`}>
                  <div className={styles.visual} data-work-visual>
                    <ProjectKnowledgeGraph project={project} compact />
                  </div>
                </Link>

                <div className={styles.projectCopy}>
                  <Link href={`/work/${project.slug}`}>
                    <h2>{project.title}</h2>
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                  <p>{project.shortDescription}</p>
                  <ul aria-label="Technology stack">
                    {project.techStack.slice(0, 8).map((tech) => <li key={tech}>{tech}</li>)}
                  </ul>
                  <a className={styles.liveLink} href={project.liveUrl} target="_blank" rel="noreferrer">
                    Open live product <ExternalLink aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.principles}>
          <header>
            <p>How I build</p>
            <h2>Ambition, with operating discipline.</h2>
          </header>
          <div>
            <article><span>Model</span><h3>Make the system legible</h3><p>Clarify users, constraints, failure modes, and the measurable signal before choosing the implementation.</p></article>
            <article><span>Build</span><h3>Engineer the leverage</h3><p>Use AI where it compounds capability. Use dependable software boundaries everywhere else.</p></article>
            <article><span>Operate</span><h3>Own the production loop</h3><p>Observability, evaluation, security, and recovery belong in the product from the first live release.</p></article>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
