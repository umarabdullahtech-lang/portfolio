import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import { publicContactEmail } from "@/lib/contact";
import styles from "./Footer.module.css";

type Props = { settings?: Record<string, string> };

export default function Footer({ settings = {} }: Props) {
  const email = publicContactEmail(settings);
  const hasConnections = Boolean(settings.social_github || settings.social_linkedin || email);

  return (
    <footer className={styles.footer}>
      <div className={styles.callout}>
        <p>Have a consequential system to build?</p>
        <Link href="/#contact">
          Let&apos;s make it real <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>

      <div className={styles.grid}>
        <div className={styles.identity}>
          <span>UA / 2026</span>
          <strong>{settings.hero_name || "Umar Abdullah"}</strong>
          <p>Senior software and AI engineer shaping reliable, intelligent products.</p>
        </div>

        <nav aria-label="Footer navigation">
          <span>Explore</span>
          <Link href="/">Home</Link>
          <Link href="/work">Work</Link>
          <Link href="/blog">Journal</Link>
          <Link href="/docs">API docs</Link>
        </nav>

        <div className={styles.socials}>
          <span>Connect</span>
          {settings.social_github && <a href={settings.social_github} target="_blank" rel="noreferrer"><GithubIcon /> GitHub</a>}
          {settings.social_linkedin && <a href={settings.social_linkedin} target="_blank" rel="noreferrer"><LinkedinIcon /> LinkedIn</a>}
          {email && <a href={`mailto:${email}`}><Mail aria-hidden="true" /> Email</a>}
          {!hasConnections && <Link href="/#contact">Contact form</Link>}
        </div>
      </div>

      <div className={styles.legal}>
        <p>© {new Date().getFullYear()} Umar Abdullah</p>
        <p>Designed for clarity. Engineered for speed.</p>
        <a href="#main-content">Back to top ↑</a>
      </div>
    </footer>
  );
}
