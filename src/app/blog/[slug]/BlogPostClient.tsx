"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import type { BlogPost } from "@/types/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./BlogPost.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

interface BlogPostClientProps {
  post: BlogPost;
  settings: Record<string, string>;
}

export default function BlogPostClient({ post, settings }: BlogPostClientProps) {
  const scope = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from("[data-post-title]", { yPercent: 105, duration: 1.25, ease: "power4.out" });
    gsap.to("[data-post-orbit]", { yPercent: 52, rotate: 110, opacity: .12, ease: "none", scrollTrigger: { trigger: "[data-post-hero]", start: "top top", end: "bottom top", scrub: .8 } });
    gsap.from("[data-article-body]", { opacity: 0, y: 70, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: "[data-article-body]", start: "top 88%", once: true } });
  }, { scope });

  return (
    <div className={styles.page} ref={scope}>
      <div className={styles.progress} aria-hidden="true"><i style={{ transform: `scaleX(${progress / 100})` }} /></div>
      <Navbar />
      <main id="main-content">
        <header className={styles.hero} data-post-hero>
          <div className={styles.orbit} data-post-orbit aria-hidden="true"><i /><i /><i /></div>
          <Link href="/blog" className={styles.back}><ArrowLeft /> Journal index</Link>
          <div className={styles.metaLine}>
            <span>{post.featured ? "Featured field note" : "Engineering field note"}</span>
            <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
            <span>{post.readingTime} min read</span>
          </div>
          <div className={styles.titleClip}>
            <h1 data-post-title>{post.title}</h1>
          </div>
          <div className={styles.heroFooter}>
            <p>{post.excerpt}</p>
            <div>{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
        </header>

        <section className={styles.articleLayout}>
          <aside>
            <div>
              <span>Author</span>
              <strong>{post.author.name}</strong>
            </div>
            <div>
              <span>Reading time</span>
              <strong><Clock /> {post.readingTime} minutes</strong>
            </div>
            <div>
              <span>Progress</span>
              <strong>{Math.round(progress)}%</strong>
            </div>
            <Link href="/#contact">Discuss a system <ArrowUpRight /></Link>
          </aside>

          <article className={styles.article} data-article-body>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h2 className={styles.articleTitle}>{children}</h2>,
                h2: ({ children }) => <h2>{children}</h2>,
                h3: ({ children }) => <h3>{children}</h3>,
                p: ({ children }) => <p>{children}</p>,
                ul: ({ children }) => <ul>{children}</ul>,
                ol: ({ children }) => <ol>{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                strong: ({ children }) => <strong>{children}</strong>,
                em: ({ children }) => <em>{children}</em>,
                blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<"code">) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <div className={styles.codeBlock}>
                      <div><span /><span /><span /><strong>{match[1]}</strong></div>
                      <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: "1.5rem", background: "#0b0d13", fontSize: ".84rem" }}>
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    </div>
                  ) : <code className={styles.inlineCode} {...props}>{children}</code>;
                },
                a: ({ children, href }) => <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noreferrer" : undefined}>{children}</a>,
                table: ({ children }) => <div className={styles.tableWrap}><table>{children}</table></div>,
                th: ({ children }) => <th>{children}</th>,
                td: ({ children }) => <td>{children}</td>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </section>

        <section className={styles.articleEnd}>
          <span>End of transmission</span>
          <h2>Ideas become useful when they enter the system.</h2>
          <div>
            <Link href="/blog"><ArrowLeft /> All field notes</Link>
            <Link href="/work">Explore the work <ArrowUpRight /></Link>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
