import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, SnapchatIcon, XIcon } from "@/components/SocialIcons";
import { buildProfile, type SocialNetwork } from "@/lib/profile";
import styles from "./Footer.module.css";

type Props = { settings?: Record<string, string> };

const socialIcons: Record<SocialNetwork, typeof GithubIcon> = {
  linkedin: LinkedinIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  snapchat: SnapchatIcon,
  x: XIcon,
};

export default function Footer({ settings = {} }: Props) {
  const profile = buildProfile(settings);

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
          <strong>{profile.name}</strong>
          <p>Senior software and AI engineer shaping reliable, intelligent products.</p>
        </div>

        <nav aria-label="Footer navigation">
          <span>Explore</span>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/work">Work</Link>
          <Link href="/blog">Journal</Link>
          <Link href="/docs">API docs</Link>
        </nav>

        <div className={styles.socials}>
          <span>Connect</span>
          {profile.socials.map((social) => {
            const Icon = socialIcons[social.network];
            return <a key={social.network} href={social.url} target="_blank" rel="noreferrer me"><Icon /> {social.label}</a>;
          })}
          {profile.email && <a href={profile.email.href}><Mail aria-hidden="true" /> Email</a>}
          <Link href="/about#contact">All contact details</Link>
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
