"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LogIn, LayoutDashboard, FileText, FolderKanban, Briefcase,
  Code2, Settings, Mail, LogOut, Plus, Pencil, Trash2, Save, X, Eye, EyeOff
} from "lucide-react";

type Tab = "dashboard" | "blog" | "projects" | "experiences" | "skills" | "settings" | "contacts";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => {
        if (r.ok) setAuthenticated(true);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) return null;

  if (!authenticated) return <LoginForm onLogin={() => setAuthenticated(true)} />;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setAuthenticated(false);
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "blog", label: "Blog Posts", icon: FileText },
    { key: "projects", label: "Projects", icon: FolderKanban },
    { key: "experiences", label: "Experience", icon: Briefcase },
    { key: "skills", label: "Skills", icon: Code2 },
    { key: "settings", label: "Settings", icon: Settings },
    { key: "contacts", label: "Contacts", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-white">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                tab === key ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {tab === "dashboard" && <DashboardTab />}
        {tab === "blog" && <BlogTab />}
        {tab === "projects" && <CrudTab entity="projects" fields={projectFields} />}
        {tab === "experiences" && <CrudTab entity="experiences" fields={experienceFields} />}
        {tab === "skills" && <CrudTab entity="skills" fields={skillFields} />}
        {tab === "settings" && <SettingsTab />}
        {tab === "contacts" && <ContactsTab />}
      </main>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onLogin();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 border border-white/10 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <LogIn size={20} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
            <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              autoComplete="email"
              className="w-full px-4 py-2.5 glass border border-white/10 rounded-lg text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/60 bg-transparent" placeholder="admin@example.com" />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <input id="login-password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 pr-10 glass border border-white/10 rounded-lg text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/60 bg-transparent" placeholder="********" />
              <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors cursor-pointer">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardTab() {
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const cards = [
    { label: "Blog Posts", value: stats.posts, color: "indigo" },
    { label: "Projects", value: stats.projects, color: "violet" },
    { label: "Experiences", value: stats.experiences, color: "cyan" },
    { label: "Skills", value: stats.skills, color: "emerald" },
    { label: "Contact Messages", value: stats.contacts, color: "amber" },
    { label: "Unread Messages", value: stats.unreadContacts, color: "rose" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-xl p-6 border border-white/5">
            <p className="text-slate-400 text-sm mb-1">{c.label}</p>
            <p className="text-3xl font-bold text-white">{c.value ?? "..."}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogTab() {
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    fetch("/api/blog?limit=100").then((r) => r.json()).then((d) => setPosts(d.posts || []));
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (data: Record<string, unknown>) => {
    const isNew = !data.id;
    const url = isNew ? "/api/blog" : `/api/blog/${data.slug}`;
    const method = isNew ? "POST" : "PUT";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    setEditing(null);
    setCreating(false);
    load();
  };

  const remove = async (slug: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${slug}`, { method: "DELETE", credentials: "include" });
    load();
  };

  if (editing || creating) {
    return <BlogForm post={editing} onSave={save} onCancel={() => { setEditing(null); setCreating(false); }} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm cursor-pointer">
          <Plus size={16} /> New Post
        </button>
      </div>
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id as string} className="glass rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{p.title as string}</h3>
              <p className="text-slate-500 text-sm">{p.slug as string} · {p.status as string} · {new Date(p.publishedAt as string).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(p)} className="p-2 text-slate-400 hover:text-indigo-400 cursor-pointer"><Pencil size={16} /></button>
              <button onClick={() => remove(p.slug as string)} className="p-2 text-slate-400 hover:text-red-400 cursor-pointer"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogForm({ post, onSave, onCancel }: {
  post: Record<string, unknown> | null;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    slug: (post?.slug as string) || "",
    title: (post?.title as string) || "",
    excerpt: (post?.excerpt as string) || "",
    content: (post?.content as string) || "",
    tags: (post?.tags as string[] || []).join(", "),
    category: (post?.category as string) || "",
    readingTime: (post?.readingTime as number) || 5,
    status: (post?.status as string) || "published",
    featured: (post?.featured as boolean) || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(post?.id ? { id: post.id } : {}),
      slug: form.slug, title: form.title, excerpt: form.excerpt, content: form.content,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      category: form.category || null, readingTime: form.readingTime,
      status: form.status, featured: form.featured,
    });
  };

  const inputClass = "w-full px-4 py-2.5 glass border border-white/10 rounded-lg text-sm text-white outline-none focus:border-indigo-500/60 bg-transparent";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{post ? "Edit Post" : "New Post"}</h2>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={20} /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className={inputClass} disabled={!!post} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required rows={2} className={`${inputClass} resize-none`} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Content (Markdown)</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={15} className={`${inputClass} resize-y font-mono text-xs`} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Reading Time (min)</label>
            <input type="number" value={form.readingTime} onChange={(e) => setForm({ ...form, readingTime: parseInt(e.target.value) })} className={inputClass} />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
            Featured
          </label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`${inputClass} w-auto`}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm cursor-pointer">
          <Save size={16} /> Save Post
        </button>
      </form>
    </div>
  );
}

type FieldDef = { key: string; label: string; type: "text" | "number" | "textarea" | "boolean" | "tags"; };

const projectFields: FieldDef[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "techStack", label: "Tech Stack (comma-separated)", type: "tags" },
  { key: "liveUrl", label: "Live URL", type: "text" },
  { key: "githubUrl", label: "GitHub URL", type: "text" },
  { key: "featured", label: "Featured", type: "boolean" },
  { key: "sortOrder", label: "Sort Order", type: "number" },
];

const experienceFields: FieldDef[] = [
  { key: "company", label: "Company", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "period", label: "Period", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "location", label: "Location", type: "text" },
  { key: "type", label: "Type (work/education)", type: "text" },
  { key: "current", label: "Current", type: "boolean" },
  { key: "sortOrder", label: "Sort Order", type: "number" },
];

const skillFields: FieldDef[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "category", label: "Category", type: "text" },
  { key: "proficiency", label: "Proficiency (%)", type: "number" },
  { key: "sortOrder", label: "Sort Order", type: "number" },
];

function CrudTab({ entity, fields }: { entity: string; fields: FieldDef[] }) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/${entity}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setItems(d[entity] || []));
  }, [entity]);

  useEffect(() => { load(); }, [load]);

  const save = async (data: Record<string, unknown>) => {
    const isNew = !data.id;
    const url = isNew ? `/api/admin/${entity}` : `/api/admin/${entity}/${data.id}`;
    const method = isNew ? "POST" : "PUT";
    const payload = { ...data };
    if (isNew) delete payload.id;
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    setEditing(null);
    setCreating(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/${entity}/${id}`, { method: "DELETE", credentials: "include" });
    load();
  };

  if (editing || creating) {
    return <CrudForm item={editing} fields={fields} onSave={save} onCancel={() => { setEditing(null); setCreating(false); }} title={entity} />;
  }

  const displayField = fields[0].key;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white capitalize">{entity}</h2>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm cursor-pointer">
          <Plus size={16} /> Add New
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id as string} className="glass rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{item[displayField] as string}</h3>
              {fields[1] && <p className="text-slate-500 text-sm truncate max-w-md">{String(item[fields[1].key] || "")}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(item)} className="p-2 text-slate-400 hover:text-indigo-400 cursor-pointer"><Pencil size={16} /></button>
              <button onClick={() => remove(item.id as string)} className="p-2 text-slate-400 hover:text-red-400 cursor-pointer"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CrudForm({ item, fields, onSave, onCancel, title }: {
  item: Record<string, unknown> | null;
  fields: FieldDef[];
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  title: string;
}) {
  const [form, setForm] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.type === "tags") {
        init[f.key] = ((item?.[f.key] as string[]) || []).join(", ");
      } else {
        init[f.key] = item?.[f.key] ?? (f.type === "boolean" ? false : f.type === "number" ? 0 : "");
      }
    }
    if (item?.id) init.id = item.id;
    return init;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form };
    for (const f of fields) {
      if (f.type === "tags") {
        data[f.key] = (data[f.key] as string).split(",").map((t: string) => t.trim()).filter(Boolean);
      } else if (f.type === "number") {
        data[f.key] = Number(data[f.key]);
      }
    }
    onSave(data);
  };

  const inputClass = "w-full px-4 py-2.5 glass border border-white/10 rounded-lg text-sm text-white outline-none focus:border-indigo-500/60 bg-transparent";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white capitalize">{item ? `Edit ${title}` : `New ${title}`}</h2>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={20} /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-slate-400 mb-1">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea value={form[f.key] as string} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} rows={4} className={`${inputClass} resize-y`} />
            ) : f.type === "boolean" ? (
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={form[f.key] as boolean} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} className="rounded" />
                {f.label}
              </label>
            ) : (
              <input type={f.type === "number" ? "number" : "text"} value={form[f.key] as string | number} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={inputClass} />
            )}
          </div>
        ))}
        <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm cursor-pointer">
          <Save size={16} /> Save
        </button>
      </form>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState<{ key: string; value: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || []));
  }, []);

  const updateValue = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ settings }),
    });
    setSaving(false);
  };

  const inputClass = "w-full px-4 py-2.5 glass border border-white/10 rounded-lg text-sm text-white outline-none focus:border-indigo-500/60 bg-transparent";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Site Settings</h2>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm cursor-pointer">
          <Save size={16} /> {saving ? "Saving..." : "Save All"}
        </button>
      </div>
      <div className="space-y-4 max-w-2xl">
        {settings.map((s) => (
          <div key={s.key}>
            <label className="block text-xs font-medium text-slate-400 mb-1">{s.key}</label>
            {s.value.length > 100 ? (
              <textarea value={s.value} onChange={(e) => updateValue(s.key, e.target.value)} rows={3} className={`${inputClass} resize-y`} />
            ) : (
              <input value={s.value} onChange={(e) => updateValue(s.key, e.target.value)} className={inputClass} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsTab() {
  const [contacts, setContacts] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/admin/contacts", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []));
  }, []);

  const toggleRead = async (id: string, read: boolean) => {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, read }),
    });
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, read } : c)));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Contact Submissions</h2>
      <div className="space-y-3">
        {contacts.length === 0 && <p className="text-slate-400">No contact submissions yet.</p>}
        {contacts.map((c) => (
          <div key={c.id as string} className={`glass rounded-xl p-5 border ${c.read ? "border-white/5" : "border-indigo-500/30"}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-white font-medium">{c.name as string}</h3>
                <p className="text-slate-500 text-sm">{c.email as string}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">{new Date(c.createdAt as string).toLocaleDateString()}</span>
                <button onClick={() => toggleRead(c.id as string, !c.read)}
                  className="p-1 text-slate-400 hover:text-indigo-400 cursor-pointer" title={c.read ? "Mark unread" : "Mark read"}>
                  {c.read ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {c.subject ? <p className="text-indigo-300 text-sm font-medium mb-1">{c.subject as string}</p> : null}
            <p className="text-slate-400 text-sm">{c.message as string}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
