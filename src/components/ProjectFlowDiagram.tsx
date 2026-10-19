"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { ExternalLink, Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import styles from "./ProjectFlowDiagram.module.css";

type Props = {
  projectTitle: string;
  source: string;
};

type RenderState = "idle" | "loading" | "ready" | "error";

export default function ProjectFlowDiagram({ projectTitle, source }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const renderId = useId().replace(/:/g, "");
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<RenderState>("idle");
  const [svg, setSvg] = useState("");
  const [zoom, setZoom] = useState(1.2);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "280px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;

    async function renderDiagram() {
      setState("loading");
      try {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Diagram source returned ${response.status}`);
        const definition = await response.text();
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: "JetBrains Mono, ui-monospace, monospace",
          themeVariables: {
            background: "#090b10",
            primaryColor: "#11141b",
            primaryTextColor: "#f5f2e9",
            primaryBorderColor: "#d8ff3e",
            secondaryColor: "#17132a",
            secondaryTextColor: "#f5f2e9",
            secondaryBorderColor: "#9a7cff",
            tertiaryColor: "#0c0e14",
            tertiaryTextColor: "#c9ccd4",
            tertiaryBorderColor: "#353a45",
            lineColor: "#777f8e",
            textColor: "#f5f2e9",
            mainBkg: "#11141b",
            nodeBorder: "#d8ff3e",
            clusterBkg: "#0c0e14",
            clusterBorder: "#343944",
            edgeLabelBackground: "#090b10",
            fontSize: "14px",
          },
          flowchart: {
            curve: "basis",
            htmlLabels: true,
            nodeSpacing: 34,
            rankSpacing: 52,
            useMaxWidth: false,
          },
        });
        const rendered = await mermaid.render(`flow-${renderId}`, definition);
        if (cancelled) return;
        setSvg(rendered.svg);
        setState("ready");
      } catch (error) {
        console.error(`Unable to render ${projectTitle} architecture diagram`, error);
        if (!cancelled) setState("error");
      }
    }

    void renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [projectTitle, renderId, source, visible]);

  function changeZoom(delta: number) {
    setZoom((current) => Math.min(1.7, Math.max(.75, Number((current + delta).toFixed(2)))));
  }

  async function openFullscreen() {
    if (!root.current?.requestFullscreen) return;
    await root.current.requestFullscreen();
  }

  return (
    <div className={styles.diagram} ref={root}>
      <div className={styles.toolbar}>
        <div>
          <span>Mermaid / system architecture</span>
          <strong>{Math.round(zoom * 100)}%</strong>
        </div>
        <div className={styles.controls} role="group" aria-label="Diagram controls">
          <button type="button" onClick={() => changeZoom(-.15)} aria-label="Zoom out"><Minus aria-hidden="true" /></button>
          <button type="button" onClick={() => setZoom(1.2)} aria-label="Reset zoom"><RotateCcw aria-hidden="true" /></button>
          <button type="button" onClick={() => changeZoom(.15)} aria-label="Zoom in"><Plus aria-hidden="true" /></button>
          <button type="button" onClick={openFullscreen} aria-label="View diagram fullscreen"><Maximize2 aria-hidden="true" /></button>
        </div>
      </div>

      <div
        className={styles.canvas}
        style={{
          "--diagram-width": `${zoom * 100}%`,
          "--diagram-min-width": `${Math.round(1180 * zoom)}px`,
          "--diagram-mobile-width": `${Math.round(1000 * zoom)}px`,
        } as CSSProperties}
        aria-live="polite"
      >
        {(state === "idle" || state === "loading") && (
          <div className={styles.loading}>
            <span />
            <p>Rendering the reviewed system flow</p>
          </div>
        )}
        {state === "ready" && (
          <div
            className={styles.rendered}
            role="img"
            aria-label={`${projectTitle} detailed system architecture flow`}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
        {state === "error" && (
          <div className={styles.error}>
            <p>The interactive preview could not render in this browser.</p>
            <a href={source} target="_blank" rel="noreferrer">Open Mermaid source <ExternalLink aria-hidden="true" /></a>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span>Drag the horizontal viewport at higher zoom levels</span>
        <a href={source} target="_blank" rel="noreferrer">View .mmd source <ExternalLink aria-hidden="true" /></a>
      </div>
    </div>
  );
}
