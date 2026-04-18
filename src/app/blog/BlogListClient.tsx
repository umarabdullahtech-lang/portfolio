"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Calendar, Clock, ArrowRight, Search, Filter, X } from "lucide-react";
import Link from "next/link";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  featured: boolean;
};

type Props = { posts: Post[] };

export default function BlogListClient({ posts: allPosts }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [filteredPosts, setFilteredPosts] = useState<Post[]>(allPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(allPosts.flatMap(post => post.tags))
  ).sort();

  const handleFilter = (search: string, tag: string | null) => {
    let filtered = allPosts;
    if (search) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (tag) {
      filtered = filtered.filter(post => post.tags.includes(tag));
    }
    setFilteredPosts(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    handleFilter(query, selectedTag);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    handleFilter(searchQuery, tag);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Blog</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            All <span className="gradient-text">Posts</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Deep dives into AI engineering, web development, automation, and software architecture.
            {allPosts.length} {allPosts.length === 1 ? 'post' : 'posts'} and counting.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative mb-6">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass border border-white/10 focus:border-violet-500/40 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <Filter size={16} />
              <span>Filter by tag:</span>
            </div>
            <button
              onClick={() => handleTagSelect(null)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                selectedTag === null
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-600'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                  selectedTag === tag
                    ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                    : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {(searchQuery || selectedTag) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 text-slate-400 text-sm">
            Found {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedTag && ` tagged with "${selectedTag}"`}
          </motion.div>
        )}

        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: Math.min(i * 0.1, 0.5), duration: 0.6 }}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-violet-500/30 transition-all duration-300 flex flex-col group"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-violet-400 text-sm">
                    <Calendar size={14} />
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </time>
                  </div>
                  {post.featured && (
                    <span className="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-medium">
                      Featured
                    </span>
                  )}
                </div>

                <Link href={`/blog/${post.slug}`} className="flex-1 group-hover:text-violet-300 transition-colors">
                  <h2 className="text-white font-bold text-lg mb-3 line-clamp-2 leading-tight">{post.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                </Link>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagSelect(tag)}
                      className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs px-2 py-0.5 text-slate-500">+{post.tags.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock size={14} />
                    <span>{post.readingTime} min</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors group-hover:gap-2">
                    Read <ArrowRight size={14} className="transition-all" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="glass rounded-2xl p-12 border border-white/10 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
              <p className="text-slate-400 mb-4">Try adjusting your search or filter criteria.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedTag(null); setFilteredPosts(allPosts); }}
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                Clear filters
              </button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center pb-16"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all duration-200"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
