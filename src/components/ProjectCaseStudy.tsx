"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowUpRight, ExternalLink, Radio } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectKnowledgeGraph from "@/components/ProjectKnowledgeGraph";
import ProjectFlowDiagram from "@/components/ProjectFlowDiagram";
import type { ArchiveProject } from "@/components/WorkArchive";
import styles from "./ProjectCaseStudy.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  project: ArchiveProject;
  nextProject: ArchiveProject;
  settings: Record<string, string>;
};

export default function ProjectCaseStudy({ project, nextProject, settings }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const isLive = Boolean(project.liveUrl && project.liveUrl !== "#");
  // Open-source studies document upstream work, so they never claim "verified live" authorship.
  const isReference = project.category === "Open-source Reference";
  const systemState = isReference ? "Open-source study" : isLive ? "Verified live" : "Source reviewed";

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from("[data-case-word]", {
        yPercent: 120,
        rotate: 3,
        stagger: 0.045,
        duration: 1.05,
        ease: "power4.out",
      });

      gsap.fromTo(
        "[data-case-media]",
        { autoAlpha: 0, xPercent: 12, rotateY: -8 },
        {
          autoAlpha: 1,
          xPercent: 0,
          rotateY: 0,
          duration: 1.35,
          ease: "power4.out",
          clearProps: "opacity,visibility,transform",
        }
      );

      gsap.fromTo(
        "[data-case-depth]",
        { yPercent: 0, scale: 1 },
        {
          yPercent: 7,
          scale: .97,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-case-hero]",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-case-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 64,
          filter: "blur(10px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-architecture-node]").forEach((node, nodeIndex) => {
        gsap.from(node, {
          opacity: 0,
          x: nodeIndex % 2 ? 44 : -44,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 90%", once: true },
        });
      });
    },
    { scope }
  );

  return (
    <div className={styles.page} ref={scope}>
      <Navbar />
      <main id="main-content">
        <section className={styles.hero} data-case-hero>
          <Link href="/work" className={styles.back}><ArrowLeft aria-hidden="true" /> All work</Link>

          <div className={styles.status}>
            <span><Radio aria-hidden="true" /> {systemState}</span>
            <span>{project.category}</span>
            <span>{project.period}</span>
          </div>

          <div className={styles.heroMain}>
            <div className={styles.heroCopy}>
              <h1 aria-label={project.title}>
                {project.title.split(" ").map((word, wordIndex) => (
                  <span className={styles.wordClip} key={`${word}-${wordIndex}`}>
                    <i data-case-word>{word}&nbsp;</i>
                  </span>
                ))}
              </h1>
              <p>{project.shortDescription}</p>
              <div className={styles.heroActions}>
                {isLive && project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">Open live product <ExternalLink aria-hidden="true" /></a>
                )}
                <Link href="#system-flow">Open full system flow <ArrowUpRight aria-hidden="true" /></Link>
              </div>
            </div>

            <div className={styles.graphShell} data-case-media>
              <div className={styles.graphDepth} data-case-depth>
                <ProjectKnowledgeGraph project={project} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.brief} data-case-reveal>
          <header><p>System brief</p></header>
          <div className={styles.briefLead}>
            <p>{project.kicker}</p>
          </div>
          <dl>
            <div><dt>Engineering focus</dt><dd>{project.role}</dd></div>
            <div><dt>Domain</dt><dd>{project.category}</dd></div>
            <div><dt>Delivery window</dt><dd>{project.period}</dd></div>
            <div><dt>System state</dt><dd>{systemState}</dd></div>
          </dl>
          <div className={styles.proofRail} role="group" aria-label="Project evidence">
            {project.proof.map((proof) => (
              <div key={`${proof.value}-${proof.label}`}>
                <strong>{proof.value}</strong>
                <span>{proof.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.narrative}>
          <div className={styles.narrativeHeading}>
            <p>The engineering move</p>
            <h2>Complex behavior, made operational.</h2>
          </div>
          <div className={styles.narrativeBody}>
            <article data-case-reveal>
              <span>Constraint</span>
              <h3>The product problem</h3>
              <p>{project.challenge}</p>
            </article>
            <article data-case-reveal>
              <span>System</span>
              <h3>The architecture decision</h3>
              <p>{project.system}</p>
            </article>
            <article data-case-reveal>
              <span>Outcome</span>
              <h3>The operating result</h3>
              <p>{project.outcome}</p>
            </article>
          </div>
        </section>

        <section className={styles.capabilities} data-case-reveal>
          <header>
            <p>Delivered capability</p>
            <h2>What the system actually does.</h2>
          </header>
          <div className={styles.capabilityGrid}>
            {project.capabilities.map((capability, capabilityIndex) => (
              <div key={capability}>
                <span>{String(capabilityIndex + 1).padStart(2, "0")}</span>
                <p>{capability}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.flowSection} id="system-flow" data-case-reveal>
          <header>
            <p>Full system flow</p>
            <h2>The Mermaid diagram, rendered.</h2>
            <span>The interactive graph above is the executive view. This is the detailed service, data, control, and delivery path reviewed from source.</span>
          </header>
          <ProjectFlowDiagram projectTitle={project.title} source={`/diagrams/${project.id}.mmd`} />
        </section>

        <section className={styles.architecture} id="architecture">
          <header>
            <p>Production architecture</p>
            <h2>A concrete path through the system.</h2>
            <span>Each stage below comes from the reviewed source tree, routes, services, infrastructure, and deployment evidence.</span>
          </header>
          <ol>
            {project.architecture.map((stage, stageIndex) => (
              <li key={stage.label} data-architecture-node>
                <div className={styles.stageNumber}>{String(stageIndex + 1).padStart(2, "0")}</div>
                <div className={styles.stageCopy}>
                  <span>{stage.label}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.detail}</p>
                  <div>{stage.technologies.map((technology) => <small key={technology}>{technology}</small>)}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.decisions} data-case-reveal>
          <header>
            <p>Engineering judgment</p>
            <h2>The decisions behind the delivery.</h2>
          </header>
          <div>
            {project.engineeringNotes.map((note) => (
              <article key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.stack} data-case-reveal>
          <header><p>Technical constellation</p></header>
          <div>
            {project.techStack.map((tech, techIndex) => (
              <span key={tech}><i>{String(techIndex + 1).padStart(2, "0")}</i>{tech}</span>
            ))}
          </div>
        </section>

        <section className={styles.liveEvidence} data-case-reveal>
          <figure>
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(max-width: 700px) 100vw, 55vw"
            />
          </figure>
          <div>
            <span>{isReference ? "Upstream evidence" : isLive ? "Deployment evidence" : "Source evidence"}</span>
            <h2>{isReference ? "This is the upstream project." : isLive ? "This is running software." : "The system is documented."}</h2>
            <p>
              {project.verification}. {isLive
                ? "The public link is provided as evidence, while protected product areas correctly remain behind authentication."
                : "Its reviewed architecture and functional flow remain available without presenting an unverified public deployment."}
            </p>
            {isLive && project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">Open {project.title} <ExternalLink aria-hidden="true" /></a>
            )}
          </div>
        </section>

        <section className={styles.nextCase}>
          <p>Continue through the project archive</p>
          <Link href={`/work/${nextProject.slug}`}>
            <span>Next case</span>
            <strong>{nextProject.title}</strong>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
