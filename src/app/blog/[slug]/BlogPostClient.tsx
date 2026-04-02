"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import type { BlogPost } from "@/types/blog";

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          {/* Featured badge */}
          {post.featured && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-medium">
                Featured Post
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-slate-400 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{post.readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <span>By</span>
              <span className="text-white font-medium">{post.author.name}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-8">
            <Tag size={16} className="text-slate-500" />
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.header>

        {/* Article content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-2xl p-8 lg:p-12 border border-white/10"
        >
          <div className="prose prose-invert prose-violet max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 mt-8 first:mt-0 gradient-text">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 mt-8 border-b border-slate-800 pb-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-slate-300">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="text-white font-semibold">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="text-violet-300">
                    {children}
                  </em>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-violet-500 pl-4 italic text-slate-400 bg-violet-500/5 rounded-r-lg py-2 my-6">
                    {children}
                  </blockquote>
                ),
                code: ({ className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;

                  return isInline ? (
                    <code
                      className="bg-slate-800 text-violet-300 px-1.5 py-0.5 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <div className="rounded-lg overflow-hidden my-6">
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="!bg-[#0f111a] !text-sm"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-violet-400 hover:text-violet-300 transition-colors underline decoration-violet-400/50 hover:decoration-violet-300"
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full border-collapse border border-slate-700 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-slate-700 px-4 py-2 bg-slate-800 text-white font-semibold text-left">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-slate-700 px-4 py-2 text-slate-300">
                    {children}
                  </td>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.article>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 mb-24"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Link
              href="/blog"
              className="flex items-center gap-2 px-6 py-3 glass border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-200"
            >
              <ArrowLeft size={16} />
              All Posts
            </Link>
            <Link
              href="/#contact"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl text-sm font-medium transition-all duration-200 hover:from-violet-600 hover:to-indigo-600"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}