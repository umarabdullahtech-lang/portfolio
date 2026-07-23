"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, BookOpen, Calendar, Clock } from "lucide-react";
import Link from "next/link";

type BlogPostData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  publishedAt: Date;
  readingTime: number;
};

type Props = { posts: BlogPostData[] };

export default function Blog({ posts }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog" ref={ref} className="relative overflow-hidden border-t-[3px] border-black bg-black px-5 py-28 text-[var(--paper)] sm:px-8 md:py-40 lg:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-20 blueprint-grid" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative mb-16 grid gap-8 border-b-[3px] border-[var(--paper)] pb-10 lg:grid-cols-[0.8fr_0.4fr] lg:items-end"
        >
          <div>
            <span className="mb-6 inline-flex border-2 border-[var(--paper)] bg-[var(--signal)] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.1em] text-black shadow-[4px_4px_0_#f3efe4]">
              journal.tail --latest
            </span>
            <h2 className="section-heading text-[var(--paper)]">
              Latest <span className="text-[var(--signal)]">Insights</span>
            </h2>
          </div>
          <p className="border-l-[6px] border-[var(--signal)] pl-5 text-lg font-semibold leading-relaxed text-[#c8c2b6]">
            Sharing knowledge about AI engineering, web development, and software architecture.
          </p>
        </motion.header>

        <div className="relative grid grid-flow-dense gap-7 lg:grid-cols-2">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 35 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.55 }}
              className="group border-[3px] border-[var(--paper)] bg-black p-6 shadow-[8px_8px_0_#ff3b19] transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_#ff3b19] sm:p-8"
              data-parallax={index % 2 ? "-3" : "-1"}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[var(--paper)] pb-5 font-mono text-[10px] font-bold uppercase tracking-[0.08em]">
                <time dateTime={new Date(post.publishedAt).toISOString()} className="flex items-center gap-2 text-[var(--paper)]">
                  <Calendar size={14} className="text-[var(--signal)]" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                {post.featured && <span className="bg-[var(--signal)] px-2 py-1 text-black">featured.log</span>}
              </div>

              <h3 className="mt-7 text-3xl font-black uppercase leading-[0.98] tracking-[-0.05em] text-[var(--paper)] transition-colors group-hover:text-[var(--signal)] sm:text-4xl">
                {post.title}
              </h3>
              <p className="mt-5 text-sm font-medium leading-relaxed text-[#b7b1a5] sm:text-base">{post.excerpt}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="border border-[var(--paper)] px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wide text-[var(--paper)]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 border-t-2 border-[var(--paper)] pt-5 font-mono text-[10px] font-black uppercase tracking-wider">
                <span className="flex items-center gap-2 text-[#b7b1a5]">
                  <Clock size={14} /> {post.readingTime} min read
                </span>
                <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 bg-[var(--signal)] px-3 py-2 text-black transition-transform group-hover:translate-x-1">
                  Read output <ArrowUpRight size={14} strokeWidth={3} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-14 flex justify-end"
        >
          <Link href="/blog" className="hard-button bg-[var(--paper)] px-6 py-4 text-black shadow-[6px_6px_0_#ff3b19]">
            <BookOpen size={16} /> View all posts <ArrowUpRight size={16} strokeWidth={3} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
