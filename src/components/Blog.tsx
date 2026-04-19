"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
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
    <section id="blog" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Blog
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Latest <span className="gradient-text">Insights</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Sharing knowledge about AI engineering, web development, and software architecture.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {posts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass rounded-2xl p-6 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 group"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-violet-400 text-sm">
                  <Calendar size={16} />
                  <time dateTime={new Date(post.publishedAt).toISOString()}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                {post.featured && (
                  <span className="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-medium">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="text-white font-bold text-xl mb-3 group-hover:text-violet-300 transition-colors">
                {post.title}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs px-2 py-0.5 text-slate-500">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock size={14} />
                  <span>{post.readingTime} min read</span>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors group-hover:gap-2"
                >
                  Read more
                  <ArrowRight size={14} className="transition-all" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-200"
          >
            <BookOpen size={16} />
            View All Posts
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
