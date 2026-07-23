import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import styles from "./Footer.module.css";

type Props = { settings?: Record<string, string> };

export default function Footer({ settings = {} }: Props) {
  const email = settings.contact_email || "umar@example.com";

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
          <Link href="/work">Selected work</Link>
          <Link href="/blog">Journal</Link>
          <Link href="/docs">API docs</Link>
        </nav>

        <div className={styles.socials}>
          <span>Connect</span>
          <a href={settings.social_github || "#"} target="_blank" rel="noreferrer"><GithubIcon /> GitHub</a>
          <a href={settings.social_linkedin || "#"} target="_blank" rel="noreferrer"><LinkedinIcon /> LinkedIn</a>
          <a href={`mailto:${email}`}><Mail /> Email</a>
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
