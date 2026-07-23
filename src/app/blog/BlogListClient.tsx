"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./BlogList.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  featured: boolean;
};

type Props = { posts: Post[]; settings: Record<string, string> };

export default function BlogListClient({ posts, settings }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const tags = useMemo(() => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(), [posts]);
  const filtered = useMemo(() => posts.filter((post) => {
    const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
    return (!search || haystack.includes(search.toLowerCase())) && (!tag || post.tags.includes(tag));
  }), [posts, search, tag]);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from("[data-journal-line]", { yPercent: 110, stagger: .1, duration: 1.2, ease: "power4.out" });
    gsap.to("[data-journal-object]", { yPercent: 40, rotate: 90, opacity: .15, ease: "none", scrollTrigger: { trigger: "[data-journal-hero]", start: "top top", end: "bottom top", scrub: .8 } });
    gsap.utils.toArray<HTMLElement>("[data-journal-entry]").forEach((entry) => {
      gsap.from(entry, { opacity: 0, y: 55, duration: .95, ease: "power3.out", scrollTrigger: { trigger: entry, start: "top 90%", once: true } });
    });
  }, { scope });

  return (
    <div className={styles.page} ref={scope}>
      <Navbar />
      <main id="main-content">
        <section className={styles.hero} data-journal-hero>
          <div className={styles.journalObject} data-journal-object aria-hidden="true"><i /><i /><i /></div>
          <p>Engineering journal / {String(posts.length).padStart(2, "0")} transmissions</p>
          <h1>
            <span><i data-journal-line>Field</i></span>
            <span><i data-journal-line>notes.</i></span>
          </h1>
          <div className={styles.heroFooter}>
            <p>Patterns, failures, and operating lessons from building production AI and software systems.</p>
            <span>Written from the work, not around it.</span>
          </div>
        </section>

        <section className={styles.archive}>
          <header className={styles.archiveHeader}>
            <div>
              <span>Archive control</span>
              <strong>{filtered.length} / {posts.length} notes visible</strong>
            </div>
            <label className={styles.search}>
              <Search aria-hidden="true" />
              <span className="sr-only">Search journal</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ideas, systems, tools…" />
              {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X /></button>}
            </label>
          </header>

          <div className={styles.tags} aria-label="Filter by topic">
            <button className={!tag ? styles.activeTag : ""} onClick={() => setTag(null)}>All notes</button>
            {tags.map((item) => <button key={item} className={tag === item ? styles.activeTag : ""} onClick={() => setTag(item)}>{item}</button>)}
          </div>

          <div className={styles.entries}>
            {filtered.length ? filtered.map((post, index) => (
              <article key={post.slug} data-journal-entry className={styles.entry}>
                <div className={styles.entryIndex}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {post.featured && <strong>Editor&apos;s signal</strong>}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <div className={styles.entryMeta}>
                    <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</time>
                    <span>{post.readingTime} min read</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <ul>{post.tags.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
                </Link>
                <Link href={`/blog/${post.slug}`} className={styles.entryArrow} aria-label={`Read ${post.title}`}><ArrowUpRight /></Link>
              </article>
            )) : (
              <div className={styles.empty}>
                <span>0 results</span>
                <h2>No note matches that signal.</h2>
                <button onClick={() => { setSearch(""); setTag(null); }}>Reset archive</button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
