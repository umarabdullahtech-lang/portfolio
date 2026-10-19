"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, Search, X } from "lucide-react";
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
  referenceProjects: ArchiveProjectSummary[];
  settings: Record<string, string>;
};

function matchesFilters(project: ArchiveProjectSummary, query: string, category: string | null) {
  if (category && project.category !== category) return false;
  if (!query) return true;
  return [project.title, project.shortDescription, project.category, project.techStack.join(" ")]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

export default function WorkArchive({ liveProjects, documentedProjects, referenceProjects, settings }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const liveCount = liveProjects.length;
  const documentedCount = documentedProjects.length;
  const projectCount = liveCount + documentedCount;
  const totalEntries = projectCount + referenceProjects.length;
  const firstProject = liveProjects[0] || documentedProjects[0];

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of [...liveProjects, ...documentedProjects, ...referenceProjects]) {
      counts.set(project.category, (counts.get(project.category) || 0) + 1);
    }
    return Array.from(counts).sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]));
  }, [liveProjects, documentedProjects, referenceProjects]);

  const search = query.trim().toLowerCase();
  const visibleLive = liveProjects.filter((project) => matchesFilters(project, search, category));
  const visibleDocumented = documentedProjects.filter((project) => matchesFilters(project, search, category));
  const visibleReferences = referenceProjects.filter((project) => matchesFilters(project, search, category));
  const visibleCount = visibleLive.length + visibleDocumented.length + visibleReferences.length;
  const filtered = Boolean(search || category);

  function clearFilters() {
    setQuery("");
    setCategory(null);
  }

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

  // Filtering changes the page height, so scroll-linked reveals need fresh positions.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [search, category]);

  return (
    <div className={styles.page} ref={scope}>
      <Navbar />
      <main id="main-content">
        <section className={styles.hero} data-work-hero>
          <div className={styles.scene} data-work-scene aria-hidden="true">
            <SpatialScene />
          </div>
          <div className={styles.heroGrid} aria-hidden="true" />
          <p className={styles.eyebrow}>Work archive</p>
          <h1 data-work-title aria-label={`${projectCount} systems. Built to work.`}>
            <span><data value={projectCount}>{projectCount}</data> systems.</span>
            <span>Built to work.</span>
          </h1>
          <div className={styles.heroBottom}>
            <p>
              A reviewed record of production AI, platforms, automation, commerce, data systems, and engineering tools.
            </p>
            <div className={styles.heroMetrics} role="group" aria-label="Project archive totals">
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

          <div className={styles.filters}>
            <label className={styles.search}>
              <Search aria-hidden="true" />
              <span className="sr-only">Search projects</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, stack, or domain" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X aria-hidden="true" /></button>}
            </label>
            <div className={styles.categories} role="group" aria-label="Filter by category">
              <button type="button" aria-pressed={!category} onClick={() => setCategory(null)}>
                All <span>{totalEntries}</span>
              </button>
              {categories.map(([name, count]) => (
                <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(category === name ? null : name)}>
                  {name} <span>{count}</span>
                </button>
              ))}
            </div>
            <p className={styles.resultCount} role="status">
              {filtered ? `Showing ${visibleCount} of ${totalEntries} entries` : `${totalEntries} entries`}
            </p>
          </div>

          {visibleCount === 0 && (
            <div className={styles.emptyState}>
              <h2>No projects match {search ? `“${query.trim()}”` : "this filter"}{category ? ` in ${category}` : ""}.</h2>
              <button type="button" onClick={clearFilters}>Clear filters</button>
            </div>
          )}

          {visibleLive.length > 0 && (
            <>
              <div className={styles.archiveBand}>
                <span>01 / Verified live systems</span>
                <strong>{String(visibleLive.length).padStart(2, "0")} public deployments</strong>
              </div>

              <div className={styles.projectList}>
                {visibleLive.map((project) => (
                  <article className={styles.project} data-work-item key={project.id}>
                    <div className={styles.projectMeta}>
                      <span>{project.category}</span>
                      <strong>{project.role}</strong>
                      <data>Live / verified</data>
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
            </>
          )}

          {visibleDocumented.length > 0 && (
            <>
              <div className={styles.archiveBand}>
                <span>02 / Source-reviewed systems</span>
                <strong>{String(visibleDocumented.length).padStart(2, "0")} documented projects</strong>
              </div>

              <div className={styles.documentedGrid}>
                {visibleDocumented.map((project, projectIndex) => (
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
            </>
          )}

          {visibleReferences.length > 0 && (
            <>
              <div className={styles.archiveBand}>
                <span>03 / Open-source studies</span>
                <strong>{String(visibleReferences.length).padStart(2, "0")} upstream projects</strong>
              </div>
              <p className={styles.bandNote}>
                Upstream projects I reviewed and ran locally to study their architecture. They are listed for reference, not as my original work.
              </p>

              <div className={styles.documentedGrid}>
                {visibleReferences.map((project) => (
                  <article className={styles.documentedProject} key={project.id}>
                    <div className={styles.documentedMeta}>
                      <span>Open source</span>
                      <span>Upstream study</span>
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
            </>
          )}
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
