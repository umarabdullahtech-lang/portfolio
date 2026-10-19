import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Download, MapPin, MessageSquareText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, SnapchatIcon, WhatsappIcon, XIcon } from "@/components/SocialIcons";
import { getSiteSettings } from "@/lib/data";
import { buildProfile, type SocialNetwork } from "@/lib/profile";
import { ActionIcon, CopyButton, LocalTime, QuickContactBar, type QuickAction } from "./ContactActions";
import styles from "./about.module.css";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#06070a",
};

export async function generateMetadata(): Promise<Metadata> {
  const profile = buildProfile(await getSiteSettings());
  const description = `How to reach ${profile.name}, ${profile.title}: phone, WhatsApp, email, and social profiles in one place.`;
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

// Long addresses wrap after the @ on narrow screens instead of mid-domain.
function breakableEmail(email: string) {
  const at = email.indexOf("@");
  return at < 0 ? email : <>{email.slice(0, at + 1)}<wbr />{email.slice(at + 1)}</>;
}

function initialsOf(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const profile = buildProfile(settings);
  const { email, phone, whatsapp } = profile;

  const actions: QuickAction[] = [
    whatsapp && { kind: "whatsapp" as const, label: "WhatsApp", href: whatsapp.href },
    phone && { kind: "phone" as const, label: "Call", href: phone.href },
    email && { kind: "email" as const, label: "Email", href: email.href },
  ].filter((action): action is QuickAction => Boolean(action));
  const canSaveContact = Boolean(phone || email);

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
    <div className={styles.page} data-has-bar={actions.length > 0 || undefined}>
      <Navbar />
      <main id="main-content" className={styles.main}>
        <section className={styles.intro} aria-labelledby="about-title">
          <div className={styles.portrait}>
            {profile.photo ? (
              <Image src={profile.photo} alt={`Portrait of ${profile.name}`} fill sizes="(min-width: 960px) 400px, 128px" fetchPriority="high" />
            ) : (
              <span aria-hidden="true">{initialsOf(profile.name)}</span>
            )}
          </div>

          <div className={styles.identity}>
            <p className={styles.eyebrow}>About and contact</p>
            <h1 id="about-title">{profile.name}</h1>
            <p className={styles.role}>{profile.title}</p>
          </div>

          <ul className={styles.facts}>
            <li><span className={styles.statusDot} aria-hidden="true" /> Available for select collaborations</li>
            {profile.location && <li><MapPin size={16} aria-hidden="true" /> {profile.location}</li>}
            <li><Clock3 size={16} aria-hidden="true" /> <LocalTime timeZone={profile.timeZone} /></li>
          </ul>

          {actions.length > 0 && (
            <div id="primary-actions" className={styles.actions}>
              {actions.map((action, index) => (
                <a
                  key={action.kind}
                  href={action.href}
                  className={index === 0 ? styles.actionPrimary : styles.action}
                  target={action.kind === "whatsapp" ? "_blank" : undefined}
                  rel={action.kind === "whatsapp" ? "noreferrer" : undefined}
                >
                  <ActionIcon kind={action.kind} />
                  {action.label}
                </a>
              ))}
              {canSaveContact && (
                <a href="/about/vcard" className={styles.actionSave} download="umar-abdullah.vcf">
                  <Download size={18} aria-hidden="true" />
                  Save contact
                </a>
              )}
            </div>
          )}
        </section>

        <div className={styles.details}>
          <section id="contact" className={styles.section} aria-labelledby="contact-title">
            <header className={styles.sectionHead}>
              <p className={styles.eyebrow}>01 / Direct lines</p>
              <h2 id="contact-title">Reach me directly</h2>
            </header>
            <ul className={styles.channels}>
              {phone && (
                <li>
                  <a href={phone.href} className={styles.channel}>
                    <span className={styles.channelIcon}><ActionIcon kind="phone" /></span>
                    <span className={styles.channelText}><span>Phone</span><strong>{phone.display}</strong></span>
                  </a>
                  <CopyButton value={phone.display} label="phone number" />
                </li>
              )}
              {whatsapp && (
                <li>
                  <a href={whatsapp.href} className={styles.channel} target="_blank" rel="noreferrer">
                    <span className={styles.channelIcon}><WhatsappIcon size={18} /></span>
                    <span className={styles.channelText}><span>WhatsApp</span><strong>{whatsapp.display}</strong></span>
                  </a>
                  <CopyButton value={whatsapp.display} label="WhatsApp number" />
                </li>
              )}
              {email && (
                <li>
                  <a href={email.href} className={styles.channel}>
                    <span className={styles.channelIcon}><ActionIcon kind="email" /></span>
                    <span className={styles.channelText}><span>Email</span><strong>{breakableEmail(email.display)}</strong></span>
                  </a>
                  <CopyButton value={email.display} label="email address" />
                </li>
              )}
              <li>
                <Link href="/#contact" className={styles.channel}>
                  <span className={styles.channelIcon}><MessageSquareText size={18} aria-hidden="true" /></span>
                  <span className={styles.channelText}><span>Message form</span><strong>Send a project brief</strong></span>
                  <ArrowUpRight className={styles.channelArrow} size={18} aria-hidden="true" />
                </Link>
              </li>
            </ul>
            <p className={styles.note}>I usually reply within 24 hours.</p>
          </section>

          {profile.socials.length > 0 && (
            <section className={styles.section} aria-labelledby="profiles-title">
              <header className={styles.sectionHead}>
                <p className={styles.eyebrow}>02 / Profiles</p>
                <h2 id="profiles-title">Find me online</h2>
              </header>
              <ul className={styles.profiles}>
                {profile.socials.map((social) => {
                  const Icon = socialIcons[social.network];
                  return (
                    <li key={social.network}>
                      <a href={social.url} target="_blank" rel="noreferrer me" className={styles.profileLink}>
                        <span className={styles.channelIcon}><Icon size={18} /></span>
                        <span className={styles.channelText}><span>{social.label}</span><strong>{social.handle}</strong></span>
                        <ArrowUpRight className={styles.channelArrow} size={18} aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {profile.bio.length > 0 && (
            <section className={styles.section} aria-labelledby="background-title">
              <header className={styles.sectionHead}>
                <p className={styles.eyebrow}>03 / Background</p>
                <h2 id="background-title">Who you will be working with</h2>
              </header>
              <div className={styles.bio}>
                {profile.bio.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}
              </div>
              <dl className={styles.stats}>
                <div><dt>Software engineering</dt><dd>10 years</dd></div>
                <div><dt>AI engineering</dt><dd>5 years</dd></div>
              </dl>
            </section>
          )}

          <section className={styles.cta} aria-labelledby="cta-title">
            <h2 id="cta-title">Have a system to build?</h2>
            <p>Share the problem, the constraints, and the timeline, and I will get back to you.</p>
            <div>
              <Link href="/#contact" className={styles.actionPrimary}>Send a project brief <ArrowUpRight size={18} aria-hidden="true" /></Link>
              <Link href="/work" className={styles.action}>Browse the work</Link>
            </div>
          </section>
        </div>
      </main>
      <Footer settings={settings} />
      {actions.length > 0 && <QuickContactBar actions={actions} watch="primary-actions" />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
