import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Download, Mail, MapPin, Phone, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, SnapchatIcon, WhatsappIcon, XIcon } from "@/components/SocialIcons";
import { getProjects, getSiteSettings } from "@/lib/data";
import { buildProfile, type SocialNetwork } from "@/lib/profile";
import { CopyButton, LocalTime, QuickContactBar, type QuickAction } from "./ContactActions";
import styles from "./about.module.css";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#06070a",
};

export async function generateMetadata(): Promise<Metadata> {
  const profile = buildProfile(await getSiteSettings());
  const description = `How to reach ${profile.name}, ${profile.title}: WhatsApp, phone, email, and social profiles in one place.`;
  return {
    title: `About & Contact | ${profile.name}`,
    description,
    openGraph: {
      title: `${profile.name} — About & Contact`,
      description,
      images: profile.photo ? [{ url: profile.photo, alt: `Portrait of ${profile.name}` }] : undefined,
    },
  };
}

const socialIcons: Record<SocialNetwork, typeof GithubIcon> = {
  linkedin: LinkedinIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  snapchat: SnapchatIcon,
  x: XIcon,
};

type Tile = {
  id: "whatsapp" | "phone" | "email" | SocialNetwork;
  label: string;
  detail: ReactNode;
  href: string;
  external: boolean;
  icon: ReactNode;
  copy?: { value: string; label: string };
};

// Long addresses wrap after the @ on narrow screens instead of mid-domain.
function breakableEmail(email: string) {
  const at = email.indexOf("@");
  return at < 0 ? email : <>{email.slice(0, at + 1)}<wbr />{email.slice(at + 1)}</>;
}

function initialsOf(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export default async function AboutPage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), getProjects()]);
  const profile = buildProfile(settings);
  const { email, phone, whatsapp } = profile;
  const tagline = settings.about_subtitle?.trim();
  const projectCount = projects.filter((project) => project.category !== "Open-source Reference").length;

  const contactTiles: Array<Tile | null> = [
    whatsapp ? {
      id: "whatsapp" as const,
      label: "WhatsApp",
      detail: whatsapp.display,
      href: whatsapp.href,
      external: true,
      icon: <WhatsappIcon size={22} />,
      copy: { value: whatsapp.display, label: "WhatsApp number" },
    } : null,
    phone ? {
      id: "phone" as const,
      label: "Phone",
      detail: phone.display,
      href: phone.href,
      external: false,
      icon: <Phone size={21} aria-hidden="true" />,
      copy: { value: phone.display, label: "phone number" },
    } : null,
    email ? {
      id: "email" as const,
      label: "Email",
      detail: breakableEmail(email.display),
      href: email.href,
      external: false,
      icon: <Mail size={21} aria-hidden="true" />,
      copy: { value: email.display, label: "email address" },
    } : null,
  ];
  const socialTiles: Tile[] = profile.socials.map((social) => {
    const Icon = socialIcons[social.network];
    return { id: social.network, label: social.label, detail: social.handle, href: social.url, external: true, icon: <Icon size={22} /> };
  });
  const tiles = [...contactTiles.filter((tile): tile is Tile => tile !== null), ...socialTiles];

  const quickActions: QuickAction[] = [
    whatsapp && { kind: "whatsapp" as const, label: "WhatsApp", href: whatsapp.href },
    phone && { kind: "phone" as const, label: "Call", href: phone.href },
    email && { kind: "email" as const, label: "Email", href: email.href },
  ].filter((action): action is QuickAction => Boolean(action));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    url: "https://umar-abdullah.com/about",
    ...(profile.photo && { image: `https://umar-abdullah.com${profile.photo}` }),
    ...(email && { email: email.display }),
    ...(phone && { telephone: phone.href.replace("tel:", "") }),
    ...(profile.location && { address: profile.location }),
    sameAs: profile.socials.map((social) => social.url),
  };

  return (
    <div className={styles.page} data-has-bar={quickActions.length > 0 || undefined}>
      <Navbar />
      <main id="main-content" className={styles.main}>
        <section className={styles.profile} aria-labelledby="about-title">
          <div className={styles.avatar}>
            <div className={styles.avatarImage}>
              {profile.photo ? (
                <Image src={profile.photo} alt={`Portrait of ${profile.name}`} fill sizes="(min-width: 640px) 152px, 124px" fetchPriority="high" />
              ) : (
                <span aria-hidden="true">{initialsOf(profile.name)}</span>
              )}
            </div>
            <span className={styles.onlineDot} aria-hidden="true" />
          </div>

          <h1 id="about-title">{profile.name}</h1>
          <p className={styles.role}>{profile.title}</p>
          {tagline && <p className={styles.tagline}>{tagline}</p>}

          <ul className={styles.chips}>
            <li><span className={styles.statusDot} aria-hidden="true" /> Available for select collaborations</li>
            {profile.location && <li><MapPin size={14} aria-hidden="true" /> {profile.location}</li>}
            <li><LocalTime timeZone={profile.timeZone} /></li>
          </ul>

          <dl className={styles.stats}>
            <div><dt>Years in software</dt><dd>10+</dd></div>
            <div><dt>Years in AI</dt><dd>5+</dd></div>
            <div><dt>Projects</dt><dd>{projectCount}</dd></div>
          </dl>
        </section>

        <section id="contact" className={styles.connect} aria-labelledby="connect-title">
          <h2 id="connect-title" className={styles.sectionLabel}>Connect with me</h2>
          <ul className={styles.tiles}>
            {tiles.map((tile, index) => (
              <li key={tile.id} className={styles.tile} data-network={tile.id} style={{ "--i": index } as CSSProperties}>
                <a
                  href={tile.href}
                  className={styles.tileLink}
                  target={tile.external ? "_blank" : undefined}
                  rel={tile.external ? "noreferrer me" : undefined}
                >
                  <span className={styles.tileIcon}>{tile.icon}</span>
                  <span className={styles.tileLabel}>{tile.label}</span>
                  <span className={styles.tileDetail}>{tile.detail}</span>
                </a>
                {tile.copy ? (
                  <CopyButton value={tile.copy.value} label={tile.copy.label} />
                ) : (
                  <ArrowUpRight className={styles.tileArrow} size={18} aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            {(phone || email) && (
              <a href="/about/vcard" className={styles.actionPrimary} download="umar-abdullah.vcf">
                <Download size={18} aria-hidden="true" /> Save my contact
              </a>
            )}
            <Link href="/#contact" className={styles.action}>
              <Send size={17} aria-hidden="true" /> Send a project brief
            </Link>
          </div>
          <p className={styles.note}>I usually reply within 24 hours.</p>
        </section>

        {profile.bio.length > 0 && (
          <section className={styles.about} aria-labelledby="bio-title">
            <h2 id="bio-title" className={styles.sectionLabel}>About me</h2>
            <div className={styles.bio}>
              {profile.bio.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}
            </div>
            <Link href="/work" className={styles.textLink}>Browse the work <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </section>
        )}
      </main>
      <Footer settings={settings} />
      {quickActions.length > 0 && <QuickContactBar actions={quickActions} watch="contact" />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}

