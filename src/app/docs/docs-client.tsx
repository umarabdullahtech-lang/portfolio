"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Copy,
  Check,
  Menu,
  X,
  Lock,
  Globe,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { EndpointGroup, Endpoint, HttpMethod, Param, StatusCode } from "./data";

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const animDuration = reducedMotion ? 0 : 0.2;

/* ── MethodBadge ─────────────────────────────────────────────── */

const METHOD_STYLES: Record<HttpMethod, string> = {
  GET: "bg-cyan-500/15 text-cyan-400",
  POST: "bg-emerald-500/15 text-emerald-400",
  PUT: "bg-indigo-500/15 text-indigo-400",
  DELETE: "bg-red-500/15 text-red-400",
  PATCH: "bg-violet-500/15 text-violet-400",
};

function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-widest min-w-[52px] text-center ${METHOD_STYLES[method]}`}
    >
      {method}
    </span>
  );
}

/* ── AuthBadge ───────────────────────────────────────────────── */

function AuthBadge({ auth }: { auth: boolean }) {
  if (auth) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Lock className="w-3 h-3" aria-hidden="true" />
        Auth
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 text-slate-400 border border-white/10">
      <Globe className="w-3 h-3 mr-1" aria-hidden="true" />
      Public
    </span>
  );
}

/* ── CopyButton ──────────────────────────────────────────────── */

function CopyButton({
  text,
  label,
  size = "sm",
}: {
  text: string;
  label: string;
  size?: "sm" | "md";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  const dim = size === "md" ? "w-10 h-10" : "w-8 h-8";
  const iconSize = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className={`${dim} inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors`}
    >
      {copied ? (
        <Check className={`${iconSize} text-emerald-400`} aria-hidden="true" />
      ) : (
        <Copy className={iconSize} aria-hidden="true" />
      )}
    </button>
  );
}

/* ── CodeBlock ───────────────────────────────────────────────── */

function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="bg-[#0d0d14] border border-white/6 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6 bg-white/[0.02]">
        <span className="text-xs font-mono text-slate-500">{language}</span>
        <CopyButton text={code} label="Copy code" />
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language === "curl" ? "bash" : language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "16px",
            background: "transparent",
            fontSize: "13px",
            lineHeight: "1.6",
          }}
          codeTagProps={{
            style: { fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace" },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

/* ── ParamsTable ─────────────────────────────────────────────── */

function ParamsTable({ params }: { params: Param[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/8">
            <th className="text-left py-2 text-slate-500 font-medium w-[28%]">
              Parameter
            </th>
            <th className="text-left py-2 text-slate-500 font-medium w-[16%]">
              Type
            </th>
            <th className="text-left py-2 text-slate-500 font-medium w-[16%]">
              Default
            </th>
            <th className="text-left py-2 text-slate-500 font-medium">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr
              key={p.name}
              className="border-b border-white/5 hover:bg-white/[0.02]"
            >
              <td className="py-2 font-mono text-cyan-400">
                {p.name}
                {p.required && (
                  <span className="text-red-400 ml-0.5">*</span>
                )}
              </td>
              <td className="py-2 text-violet-400">{p.type}</td>
              <td className="py-2 text-slate-500">{p.default ?? "—"}</td>
              <td className="py-2 text-slate-400">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── StatusCodeList ──────────────────────────────────────────── */

function statusCodeStyle(code: number): {
  dot: string;
  text: string;
  border: string;
} {
  if (code >= 200 && code < 300) {
    return {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      border: "border-emerald-500/20 bg-emerald-500/10",
    };
  }
  if (code === 401 || code === 403) {
    return {
      dot: "bg-amber-400",
      text: "text-amber-400",
      border: "border-amber-500/20 bg-amber-500/10",
    };
  }
  if (code === 429) {
    return {
      dot: "bg-orange-400",
      text: "text-orange-400",
      border: "border-orange-500/20 bg-orange-500/10",
    };
  }
  if (code === 503) {
    return {
      dot: "bg-red-400",
      text: "text-red-400",
      border: "border-red-500/20 bg-red-500/10",
    };
  }
  return {
    dot: "bg-red-400",
    text: "text-red-400",
    border: "border-red-500/20 bg-red-500/10",
  };
}

const STATUS_LABELS: Record<number, string> = {
  200: "OK",
  201: "Created",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  429: "Rate Limited",
  500: "Server Error",
  503: "Service Unavailable",
};

function StatusCodeList({ errors }: { errors: StatusCode[] }) {
  const allCodes = [200, ...errors.map((e) => e.status)];
  const unique = [...new Set(allCodes)];

  return (
    <ul className="flex flex-wrap gap-2">
      {unique.map((code) => {
        const s = statusCodeStyle(code);
        return (
          <li
            key={code}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.border} ${s.text}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
              aria-hidden="true"
            />
            {code} {STATUS_LABELS[code] ?? ""}
          </li>
        );
      })}
    </ul>
  );
}

/* ── EndpointCard ────────────────────────────────────────────── */

type TabKey = "params" | "body" | "response" | "curl" | "fetch";

function EndpointCard({
  endpoint,
  id,
}: {
  endpoint: Endpoint;
  id: string;
}) {
  const [open, setOpen] = useState(false);

  const availableTabs: { key: TabKey; label: string }[] = [];
  if (endpoint.queryParams?.length) {
    availableTabs.push({ key: "params", label: "Query Params" });
  }
  if (endpoint.bodyFields?.length || endpoint.bodyExample) {
    availableTabs.push({ key: "body", label: "Request Body" });
  }
  availableTabs.push({ key: "response", label: "Response" });
  availableTabs.push({ key: "curl", label: "curl" });
  availableTabs.push({ key: "fetch", label: "fetch" });

  const [activeTab, setActiveTab] = useState<TabKey>(availableTabs[0]?.key ?? "response");

  return (
    <div className="glass border border-white/8 rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/12 hover:bg-white/[0.035]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`endpoint-${id}-body`}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-mono text-slate-200 flex-1 truncate">
          {endpoint.path}
        </code>
        <AuthBadge auth={endpoint.auth} />
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <p className="px-5 pb-3 text-xs text-slate-500">{endpoint.description}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`endpoint-${id}-body`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: animDuration, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/8">
              {/* Tabs */}
              <div
                className="flex gap-1 px-5 pt-4 pb-0 overflow-x-auto"
                role="tablist"
                aria-label="Endpoint details"
              >
                {availableTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    aria-controls={`tab-panel-${id}-${tab.key}`}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.key
                        ? "text-indigo-300 bg-indigo-500/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab panel */}
              <div
                role="tabpanel"
                id={`tab-panel-${id}-${activeTab}`}
                className="px-5 py-4"
              >
                {activeTab === "params" && endpoint.queryParams && (
                  <ParamsTable params={endpoint.queryParams} />
                )}
                {activeTab === "body" && (
                  <div className="space-y-4">
                    {endpoint.bodyFields && (
                      <ParamsTable params={endpoint.bodyFields} />
                    )}
                    {endpoint.bodyExample && (
                      <CodeBlock code={endpoint.bodyExample} language="json" />
                    )}
                  </div>
                )}
                {activeTab === "response" && (
                  <CodeBlock code={endpoint.response} language="json" />
                )}
                {activeTab === "curl" && (
                  <CodeBlock code={endpoint.curlExample} language="curl" />
                )}
                {activeTab === "fetch" && (
                  <CodeBlock code={endpoint.fetchExample} language="javascript" />
                )}
              </div>

              {/* Status codes */}
              <div className="px-5 pb-5 border-t border-white/6 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Responses
                </p>
                <StatusCodeList errors={endpoint.errors} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── DocsHero ────────────────────────────────────────────────── */

function DocsHero() {
  return (
    <div className="py-12 border-b border-white/8 mb-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
        API Reference
      </h1>
      <p className="text-base text-slate-400 leading-relaxed max-w-2xl mb-6">
        Explore the REST API powering umar-abdullah.com. Public endpoints are
        open; admin endpoints require an admin_token cookie.
      </p>
      <div className="inline-flex items-center gap-2 glass border border-white/8 rounded-xl px-4 py-2 font-mono text-sm text-slate-300">
        https://umar-abdullah.com
        <CopyButton
          text="https://umar-abdullah.com"
          label="Copy base URL"
          size="md"
        />
      </div>
    </div>
  );
}

/* ── DocsSection ─────────────────────────────────────────────── */

function DocsSection({ group }: { group: EndpointGroup }) {
  return (
    <section id={group.slug} className="mb-20 scroll-mt-[120px]">
      <h2 className="text-2xl font-bold text-slate-100 mb-2">
        {group.title}
      </h2>
      <p className="text-sm text-slate-400 mb-8">{group.description}</p>
      <div className="space-y-4">
        {group.endpoints.map((ep, i) => (
          <EndpointCard
            key={`${ep.method}-${ep.path}`}
            endpoint={ep}
            id={`${group.slug}-${i}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ── DocsSidebar ─────────────────────────────────────────────── */

function SidebarContent({
  groups,
  activeSlug,
  onLinkClick,
}: {
  groups: EndpointGroup[];
  activeSlug: string;
  onLinkClick?: () => void;
}) {
  return (
    <>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400 mb-1">
          API Reference
        </p>
        <p className="text-xs text-slate-500">v1.0 · Public &amp; Admin</p>
      </div>
      <nav aria-label="API sections">
        <ul>
          {groups.map((group) => (
            <li key={group.slug}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-6 mb-2 px-2">
                {group.title}
              </p>
              <ul>
                {group.endpoints.map((ep) => {
                  const isActive = activeSlug === group.slug;
                  return (
                    <li key={`${ep.method}-${ep.path}`}>
                      <a
                        href={`#${group.slug}`}
                        aria-current={isActive ? "true" : undefined}
                        onClick={onLinkClick}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors duration-150 ${
                          isActive
                            ? "text-indigo-300 bg-indigo-500/10 font-medium"
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        }`}
                      >
                        <MethodBadge method={ep.method} />
                        <span className="truncate font-mono text-xs">
                          {ep.path}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

function DocsSidebar({
  groups,
  activeSlug,
}: {
  groups: EndpointGroup[];
  activeSlug: string;
}) {
  return (
    <aside
      className="hidden lg:block w-[280px] shrink-0 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto border-r border-white/6 bg-white/[0.02] p-5"
      style={{ scrollbarWidth: "thin" }}
    >
      <SidebarContent groups={groups} activeSlug={activeSlug} />
    </aside>
  );
}

/* ── DocsMobileDrawer ────────────────────────────────────────── */

function DocsMobileDrawer({
  open,
  onClose,
  groups,
  activeSlug,
}: {
  open: boolean;
  onClose: () => void;
  groups: EndpointGroup[];
  activeSlug: string;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: animDuration }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Panel */}
          <motion.div
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: animDuration }}
            role="dialog"
            aria-modal="true"
            aria-label="API navigation"
            className="fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0d0d14] border-r border-white/8 pt-[72px] overflow-y-auto p-5"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="absolute top-[80px] right-3 w-10 h-10 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent
              groups={groups}
              activeSlug={activeSlug}
              onLinkClick={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── DocsMobileTopBar ────────────────────────────────────────── */

function DocsMobileTopBar({
  groups,
  activeSlug,
  onMenuOpen,
}: {
  groups: EndpointGroup[];
  activeSlug: string;
  onMenuOpen: () => void;
}) {
  return (
    <div className="lg:hidden sticky top-[72px] z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/6 h-12 px-4 flex items-center">
      {/* Mobile: hamburger only */}
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Open API navigation"
        className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Tablet: pill-scroll */}
      <div className="hidden md:flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {groups.map((group) => (
          <a
            key={group.slug}
            href={`#${group.slug}`}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors duration-150 ${
              activeSlug === group.slug
                ? "text-indigo-300 bg-indigo-500/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {group.title}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Main DocsClient ─────────────────────────────────────────── */

export default function DocsClient({ groups }: { groups: EndpointGroup[] }) {
  const [activeSlug, setActiveSlug] = useState(groups[0]?.slug ?? "");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const headings = groups.map((g) => document.getElementById(g.slug)).filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    for (const h of headings) {
      observer.observe(h);
    }
    return () => observer.disconnect();
  }, [groups]);

  return (
    <>
      <DocsMobileTopBar
        groups={groups}
        activeSlug={activeSlug}
        onMenuOpen={() => setDrawerOpen(true)}
      />
      <DocsMobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        groups={groups}
        activeSlug={activeSlug}
      />
      <div className="flex min-h-screen">
        <DocsSidebar groups={groups} activeSlug={activeSlug} />
        <main
          id="main-content"
          className="flex-1 min-w-0 max-w-4xl px-4 md:px-6 lg:px-10 py-8 md:py-10 lg:py-12"
        >
          <DocsHero />
          {groups.map((group) => (
            <DocsSection key={group.slug} group={group} />
          ))}
        </main>
      </div>
    </>
  );
}
