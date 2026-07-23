"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import type { PortfolioProject } from "@/data/projects";
import styles from "./ProjectKnowledgeGraph.module.css";

type Props = {
  project: PortfolioProject;
  compact?: boolean;
};

type Point = { x: number; y: number };

const stagePoints: Point[] = [
  { x: 50, y: 13 },
  { x: 79, y: 29 },
  { x: 81, y: 69 },
  { x: 50, y: 86 },
  { x: 19, y: 69 },
  { x: 21, y: 29 },
];

const technologyPoints: Point[] = [
  { x: 10, y: 12 },
  { x: 31, y: 6 },
  { x: 69, y: 6 },
  { x: 91, y: 14 },
  { x: 95, y: 48 },
  { x: 89, y: 87 },
  { x: 68, y: 94 },
  { x: 32, y: 94 },
  { x: 10, y: 86 },
  { x: 5, y: 48 },
];

function pointToViewBox(point: Point) {
  return { x: point.x * 10, y: point.y * 6.5 };
}

export default function ProjectKnowledgeGraph({ project, compact = false }: Props) {
  const graph = useRef<HTMLDivElement>(null);
  const stages = project.architecture.slice(0, stagePoints.length);
  const technologies = compact ? [] : project.techStack.slice(0, technologyPoints.length);
  const core = pointToViewBox({ x: 50, y: 50 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const element = graph.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    element.style.setProperty("--graph-rx", `${-y * 5}deg`);
    element.style.setProperty("--graph-ry", `${x * 6}deg`);
    element.style.setProperty("--graph-x", `${x * 9}px`);
    element.style.setProperty("--graph-y", `${y * 7}px`);
  }

  function resetPointer() {
    const element = graph.current;
    if (!element) return;
    element.style.setProperty("--graph-rx", "0deg");
    element.style.setProperty("--graph-ry", "0deg");
    element.style.setProperty("--graph-x", "0px");
    element.style.setProperty("--graph-y", "0px");
  }

  return (
    <div
      className={`${styles.graph} ${compact ? styles.compact : ""}`}
      ref={graph}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-label={`${project.title} architecture knowledge graph`}
    >
      <div className={styles.chrome}>
        <span>Architecture knowledge graph</span>
        <span>{String(stages.length + technologies.length + 1).padStart(2, "0")} connected nodes</span>
      </div>

      <div className={styles.viewport}>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.plane}>
          <svg className={styles.edges} viewBox="0 0 1000 650" aria-hidden="true">
            <ellipse className={styles.orbitPrimary} cx="500" cy="325" rx="315" ry="242" />
            <ellipse className={styles.orbitSecondary} cx="500" cy="325" rx="445" ry="302" />

            {stages.map((stage, index) => {
              const target = pointToViewBox(stagePoints[index]);
              return (
                <line
                  className={styles.primaryEdge}
                  key={`core-${stage.label}`}
                  x1={core.x}
                  y1={core.y}
                  x2={target.x}
                  y2={target.y}
                  style={{ "--edge-delay": `${index * -0.32}s` } as CSSProperties}
                />
              );
            })}

            {stages.map((stage, index) => {
              const start = pointToViewBox(stagePoints[index]);
              const end = pointToViewBox(stagePoints[(index + 1) % stages.length]);
              return <line className={styles.ringEdge} key={`ring-${stage.label}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} />;
            })}

            {technologies.map((technology, index) => {
              const start = pointToViewBox(technologyPoints[index]);
              const end = pointToViewBox(stagePoints[index % stages.length]);
              return (
                <line
                  className={styles.secondaryEdge}
                  key={`technology-${technology}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                />
              );
            })}
          </svg>

          <div className={styles.coreNode}>
            <span>System core</span>
            <strong>{project.title}</strong>
            <small>{project.category}</small>
            <i aria-hidden="true" />
          </div>

          {stages.map((stage, index) => {
            const point = stagePoints[index];
            return (
              <div
                className={styles.stageNode}
                key={stage.label}
                style={{
                  "--node-x": `${point.x}%`,
                  "--node-y": `${point.y}%`,
                  "--node-delay": `${index * -0.58}s`,
                } as CSSProperties}
              >
                <i aria-hidden="true" />
                <span>{String(index + 1).padStart(2, "0")} / {stage.label}</span>
                <strong>{stage.title}</strong>
              </div>
            );
          })}

          {technologies.map((technology, index) => {
            const point = technologyPoints[index];
            return (
              <div
                className={styles.technologyNode}
                key={technology}
                style={{
                  "--node-x": `${point.x}%`,
                  "--node-y": `${point.y}%`,
                  "--node-delay": `${index * -0.41}s`,
                } as CSSProperties}
              >
                <i aria-hidden="true" />
                <span>{technology}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.legend}>
        <span><i /> Architecture stage</span>
        <span><i /> Technology dependency</span>
        <span>Move pointer to inspect depth</span>
      </div>
    </div>
  );
}
