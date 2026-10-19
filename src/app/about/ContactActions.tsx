"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, Copy, Mail, Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/SocialIcons";
import styles from "./about.module.css";

export type QuickAction = { kind: "whatsapp" | "phone" | "email"; label: string; href: string };

export function ActionIcon({ kind }: { kind: QuickAction["kind"] }) {
  if (kind === "whatsapp") return <WhatsappIcon size={18} />;
  if (kind === "phone") return <Phone size={18} aria-hidden="true" />;
  return <Mail size={18} aria-hidden="true" />;
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button type="button" className={styles.copyButton} data-copied={copied || undefined} onClick={copy} aria-label={`Copy ${label}`}>
        <Copy className={styles.copyIdle} size={17} aria-hidden="true" />
        <Check className={styles.copyDone} size={17} aria-hidden="true" />
      </button>
      <span className="sr-only" role="status">{copied ? `${label[0].toUpperCase()}${label.slice(1)} copied` : ""}</span>
    </>
  );
}

const formatters = new Map<string, Intl.DateTimeFormat>();

function readLocalTime(timeZone: string) {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit", timeZoneName: "shortOffset" });
    formatters.set(timeZone, formatter);
  }
  return formatter.format(new Date());
}

function subscribeToClock(onChange: () => void) {
  const interval = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(interval);
}

// Rendered only in the browser, so server and client markup never disagree about the minute.
export function LocalTime({ timeZone }: { timeZone: string }) {
  const time = useSyncExternalStore(subscribeToClock, () => readLocalTime(timeZone), () => "");
  return <span className={styles.localTime}>{time ? `${time} local time` : "Local time"}</span>;
}

// Phone-sized screens only: appears once the main contact buttons scroll out of view.
export function QuickContactBar({ actions, watch }: { actions: QuickAction[]; watch: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watch);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [watch]);

  return (
    <nav className={styles.quickBar} data-visible={visible || undefined} aria-label="Quick contact" inert={!visible}>
      {actions.map((action) => (
        <a key={action.kind} href={action.href} className={styles.quickAction} target={action.kind === "whatsapp" ? "_blank" : undefined} rel={action.kind === "whatsapp" ? "noreferrer" : undefined}>
          <ActionIcon kind={action.kind} />
          <span>{action.label}</span>
        </a>
      ))}
    </nav>
  );
}
