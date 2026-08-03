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
export type ArchiveProjectSummary = Pick<
  PortfolioProject,
  "id" | "slug" | "title" | "shortDescription" | "category" | "role" | "techStack"
>;

type Props = {
  liveProjects: ArchiveProject[];
  documentedProjects: ArchiveProjectSummary[];
  settings: Record<string, string>;
};

export default function WorkArchive({ liveProjects, documentedProjects, settings }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const liveCount = liveProjects.length;
  const documentedCount = documentedProjects.length;
  const projectCount = liveCount + documentedCount;
  const firstProject = liveProjects[0] || documentedProjects[0];

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
          <p className={styles.eyebrow}>Complete systems archive</p>
          <h1 data-work-title aria-label={`${projectCount} systems. Built to work.`}>
            <span><data value={projectCount}>{projectCount}</data> systems.</span>
            <span>Built to work.</span>
          </h1>
          <div className={styles.heroBottom}>
            <p>
              A reviewed record of production AI, platforms, automation, commerce, data systems, and engineering tools.
            </p>
            <div className={styles.heroMetrics} aria-label="Project archive totals">
              <span><strong>{String(liveCount).padStart(2, "0")}</strong> Live</span>
              <span><strong>{String(documentedCount).padStart(2, "0")}</strong> Source-reviewed</span>
            </div>
            <Link href={`/work/${firstProject?.slug || "jhb-property-intelligence"}`}>
              Open the flagship <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className={styles.index} id="case-index" aria-label="Complete project case-study index">
          <header>
            <p>Complete project index</p>
            <p>AI / Software / Platforms</p>
            <p>{liveCount} live / {documentedCount} documented</p>
          </header>

          <div className={styles.archiveBand}>
            <span>01 / Verified live systems</span>
            <strong>{String(liveCount).padStart(2, "0")} public deployments</strong>
          </div>

          <div className={styles.projectList}>
            {liveProjects.map((project) => (
              <article className={styles.project} data-work-item key={project.id}>
                <div className={styles.projectMeta}>
                  <span>{project.category}</span>
                  <strong>{project.role}</strong>
                  <data>{project.liveUrl ? "Live / verified" : "Source / reviewed"}</data>
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
                  {project.liveUrl && project.liveUrl !== "#" && (
                    <a className={styles.liveLink} href={project.liveUrl} target="_blank" rel="noreferrer">
                      Open live product <ExternalLink aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className={styles.archiveBand}>
            <span>02 / Source-reviewed systems</span>
            <strong>{String(documentedCount).padStart(2, "0")} documented projects</strong>
          </div>

          <div className={styles.documentedGrid}>
            {documentedProjects.map((project, projectIndex) => (
              <article className={styles.documentedProject} key={project.id}>
                <div className={styles.documentedMeta}>
                  <span>{String(projectIndex + 1).padStart(2, "0")}</span>
                  <span>{project.category}</span>
                </div>
                <Link href={`/work/${project.slug}`}>
                  <h2>{project.title}</h2>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
                <p>{project.shortDescription}</p>
                <ul aria-label={`${project.title} technology stack`}>
                  {project.techStack.slice(0, 4).map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
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
