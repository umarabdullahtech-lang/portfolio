"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CopyPlus,
  LoaderCircle,
  Plus,
  Search,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { PortfolioProject, ProjectArchitectureStage } from "@/data/projects";

type EditableProject = Omit<PortfolioProject, "id"> & { id?: string };
type Filter = "all" | "live" | "documented" | "featured";

const inputClass = "w-full rounded-lg border border-white/10 bg-white/[0.025] px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-[#d8ff3e]/55";
const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500";
const panelClass = "rounded-xl border border-white/[0.07] bg-white/[0.018] p-5";

function newProject(sortOrder: number): EditableProject {
  return {
    slug: "",
    title: "",
    kicker: "Engineering system / reviewed architecture",
    description: "",
    shortDescription: "",
    category: "Engineering System",
    role: "Product and systems engineering",
    period: String(new Date().getFullYear()),
    status: "Documented",
    liveUrl: null,
    githubUrl: null,
    image: "/projects/project-system.svg",
    imageAlt: "",
    featured: false,
    sortOrder,
    techStack: [],
    proof: [],
    challenge: "",
    system: "",
    outcome: "",
    capabilities: [],
    architecture: [],
    engineeringNotes: [],
    verification: "Project record maintained through the portfolio CMS",
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function listFromText(value: string) {
  return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
}

async function readResponse(response: Response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed with ${response.status}`);
  return payload;
}

export default function ProjectManager() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [editing, setEditing] = useState<EditableProject | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await readResponse(await fetch("/api/admin/projects", { credentials: "include" }));
      setProjects(payload.projects || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch = !search || [project.title, project.slug, project.category, project.techStack.join(" ")]
        .join(" ").toLowerCase().includes(search);
      const matchesFilter = filter === "all"
        || (filter === "live" && Boolean(project.liveUrl))
        || (filter === "documented" && !project.liveUrl)
        || (filter === "featured" && project.featured);
      return matchesSearch && matchesFilter;
    });
  }, [filter, projects, query]);

  async function save(project: EditableProject) {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const response = await fetch(project.id ? `/api/admin/projects/${project.id}` : "/api/admin/projects", {
        method: project.id ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      await readResponse(response);
      await load();
      setSaved(true);
      setEditing(null);
      window.setTimeout(() => setSaved(false), 2400);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save project");
    } finally {
      setSaving(false);
    }
  }

  async function remove(project: PortfolioProject) {
    if (!window.confirm(`Delete “${project.title}” from the admin and public portfolio?`)) return;
    setError("");
    try {
      await readResponse(await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE", credentials: "include" }));
      setProjects((current) => current.filter((item) => item.id !== project.id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete project");
    }
  }

  if (editing) {
    return <ProjectForm project={editing} saving={saving} error={error} onSave={save} onCancel={() => { setEditing(null); setError(""); }} />;
  }

  const liveCount = projects.filter((project) => project.liveUrl).length;
  const featuredCount = projects.filter((project) => project.featured).length;

  return (
    <div className="mx-auto max-w-[1500px]">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d8ff3e]">Portfolio CMS</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white">Project archive</h1>
          <p className="mt-2 text-sm text-slate-500">Every record here is published through the same database used by the public Work pages.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(newProject((projects.at(-1)?.sortOrder || projects.length) + 1))}
          className="flex min-h-11 items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 text-sm font-semibold text-[#08090d] transition hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={17} /> New project
        </button>
      </header>

      <div className="mb-6 grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
        {[
          [projects.length, "Total projects"],
          [liveCount, "Verified live"],
          [featuredCount, "Featured systems"],
        ].map(([value, label]) => (
          <div key={String(label)} className="bg-[#0c0d12] p-4">
            <strong className="block text-2xl text-white">{value}</strong>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="flex min-w-[260px] flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-3.5">
          <Search size={15} className="text-slate-500" />
          <span className="sr-only">Search projects</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, slug, category, or stack" className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-slate-600" />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-slate-500 hover:text-white"><X size={15} /></button>}
        </label>
        <div className="flex flex-wrap gap-1 rounded-lg border border-white/10 p-1">
          {(["all", "live", "documented", "featured"] as Filter[]).map((value) => (
            <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-md px-3 py-2 font-mono text-[10px] uppercase tracking-[0.08em] transition ${filter === value ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}>
              {value}
            </button>
          ))}
        </div>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      {saved && <p role="status" className="mb-4 flex items-center gap-2 rounded-lg border border-[#d8ff3e]/25 bg-[#d8ff3e]/[0.06] px-4 py-3 text-sm text-[#e8ff94]"><Check size={15} /> Project saved and published.</p>}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center text-slate-500"><LoaderCircle className="animate-spin" /></div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/[0.07]">
          <div className="grid grid-cols-[72px_minmax(220px,1.2fr)_minmax(130px,.6fr)_90px_112px] gap-4 border-b border-white/[0.07] bg-white/[0.025] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-600 max-lg:hidden">
            <span>Order</span><span>Project</span><span>Category</span><span>Status</span><span className="text-right">Actions</span>
          </div>
          {filtered.map((project) => (
            <article key={project.id} className="grid grid-cols-1 items-center gap-3 border-b border-white/[0.07] px-4 py-4 last:border-b-0 hover:bg-white/[0.018] lg:grid-cols-[72px_minmax(220px,1.2fr)_minmax(130px,.6fr)_90px_112px] lg:gap-4">
              <span className="font-mono text-xs text-slate-600">{String(project.sortOrder).padStart(3, "0")}</span>
              <div className="min-w-0">
                <h2 className="truncate font-medium text-white">{project.title}</h2>
                <p className="mt-1 truncate font-mono text-[10px] text-slate-600">/work/{project.slug}</p>
              </div>
              <span className="truncate text-xs text-slate-400">{project.category}</span>
              <span className={project.liveUrl ? "text-xs text-[#d8ff3e]" : "text-xs text-slate-500"}>{project.liveUrl ? "Live" : "Documented"}</span>
              <div className="flex justify-end gap-1">
                <Link href={`/work/${project.slug}`} target="_blank" aria-label={`Open ${project.title}`} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white"><ArrowUpRight size={16} /></Link>
                <button type="button" onClick={() => setEditing(structuredClone(project))} aria-label={`Edit ${project.title}`} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-[#d8ff3e]"><CopyPlus size={16} /></button>
                <button type="button" onClick={() => void remove(project)} aria-label={`Delete ${project.title}`} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
          {!filtered.length && <p className="p-12 text-center text-sm text-slate-500">No project matches this view.</p>}
        </div>
      )}
    </div>
  );
}

function ProjectForm({ project, saving, error, onSave, onCancel }: {
  project: EditableProject;
  saving: boolean;
  error: string;
  onSave: (project: EditableProject) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(project);
  const [slugTouched, setSlugTouched] = useState(Boolean(project.id));

  function update<K extends keyof EditableProject>(key: K, value: EditableProject[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateTitle(title: string) {
    setForm((current) => ({ ...current, title, slug: slugTouched ? current.slug : slugify(title) }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    void onSave(form);
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[1180px] pb-16">
      <header className="sticky top-0 z-10 -mx-3 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-[#0a0a0f]/95 px-3 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancel} className="grid size-10 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-white"><ArrowLeft size={17} /></button>
          <div><h1 className="text-xl font-semibold text-white">{form.id ? "Edit project" : "New project"}</h1><p className="font-mono text-[10px] text-slate-600">{form.slug ? `/work/${form.slug}` : "Set a title to generate the route"}</p></div>
        </div>
        <div className="flex items-center gap-2">
          {form.id && <Link href={`/work/${form.slug}`} target="_blank" className="flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs text-slate-300 hover:text-white">Preview <ArrowUpRight size={14} /></Link>}
          <button type="submit" disabled={saving} className="flex min-h-10 items-center gap-2 rounded-lg bg-[#d8ff3e] px-4 text-xs font-semibold text-[#08090d] disabled:opacity-50">
            {saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />} {saving ? "Saving" : "Save project"}
          </button>
        </div>
      </header>

      {error && <p role="alert" className="mb-5 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      <div className="space-y-5">
        <section className={panelClass}>
          <SectionHeading title="Identity and routing" detail="Controls the archive card, case-study URL, and headline." />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Project title"><input required value={form.title} onChange={(event) => updateTitle(event.target.value)} className={inputClass} /></Field>
            <Field label="Route slug"><input required value={form.slug} onChange={(event) => { setSlugTouched(true); update("slug", slugify(event.target.value)); }} className={inputClass} /></Field>
            <Field label="Kicker"><input value={form.kicker} onChange={(event) => update("kicker", event.target.value)} className={inputClass} /></Field>
            <Field label="Category"><input value={form.category} onChange={(event) => update("category", event.target.value)} className={inputClass} /></Field>
            <Field label="Role"><input value={form.role} onChange={(event) => update("role", event.target.value)} className={inputClass} /></Field>
            <Field label="Period"><input value={form.period} onChange={(event) => update("period", event.target.value)} className={inputClass} /></Field>
            <Field label="Status">
              <select value={form.status} onChange={(event) => update("status", event.target.value as PortfolioProject["status"])} className={inputClass}><option value="Documented">Documented</option><option value="Live">Live</option></select>
            </Field>
            <Field label="Sort order"><input type="number" value={form.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} className={inputClass} /></Field>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} /> Feature this project on the home page</label>
        </section>

        <section className={panelClass}>
          <SectionHeading title="Public summary" detail="Keep the short description concise; the full description supports metadata and the case-study introduction." />
          <div className="space-y-4">
            <Field label="Short description"><textarea required rows={3} value={form.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} className={inputClass} /></Field>
            <Field label="Full description"><textarea required rows={5} value={form.description} onChange={(event) => update("description", event.target.value)} className={inputClass} /></Field>
          </div>
        </section>

        <section className={panelClass}>
          <SectionHeading title="Links, media, and stack" detail="Leave Live URL empty to hide the live-product button everywhere." />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Live URL"><input type="url" value={form.liveUrl || ""} onChange={(event) => update("liveUrl", event.target.value || null)} className={inputClass} /></Field>
            <Field label="GitHub URL"><input type="url" value={form.githubUrl || ""} onChange={(event) => update("githubUrl", event.target.value || null)} className={inputClass} /></Field>
            <Field label="Image path or URL"><input value={form.image} onChange={(event) => update("image", event.target.value)} className={inputClass} /></Field>
            <Field label="Image alt text"><input value={form.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} className={inputClass} /></Field>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Technology stack (comma or new line)"><textarea rows={5} value={form.techStack.join(", ")} onChange={(event) => update("techStack", listFromText(event.target.value))} className={inputClass} /></Field>
            <Field label="Capabilities (one per line)"><textarea rows={5} value={form.capabilities.join("\n")} onChange={(event) => update("capabilities", listFromText(event.target.value))} className={inputClass} /></Field>
          </div>
        </section>

        <section className={panelClass}>
          <SectionHeading title="Case-study narrative" detail="These three blocks drive the engineering story shown on the public detail page." />
          <div className="space-y-4">
            <Field label="Challenge"><textarea required rows={5} value={form.challenge} onChange={(event) => update("challenge", event.target.value)} className={inputClass} /></Field>
            <Field label="System"><textarea required rows={5} value={form.system} onChange={(event) => update("system", event.target.value)} className={inputClass} /></Field>
            <Field label="Outcome"><textarea required rows={5} value={form.outcome} onChange={(event) => update("outcome", event.target.value)} className={inputClass} /></Field>
            <Field label="Verification note"><input value={form.verification} onChange={(event) => update("verification", event.target.value)} className={inputClass} /></Field>
          </div>
        </section>

        <ProofEditor values={form.proof} onChange={(value) => update("proof", value)} />
        <ArchitectureEditor values={form.architecture} onChange={(value) => update("architecture", value)} />
        <NotesEditor values={form.engineeringNotes} onChange={(value) => update("engineeringNotes", value)} />
      </div>
    </form>
  );
}

function SectionHeading({ title, detail }: { title: string; detail: string }) {
  return <header className="mb-5 border-b border-white/[0.07] pb-4"><h2 className="font-medium text-white">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></header>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span className={labelClass}>{label}</span>{children}</label>;
}

function EmptyRow({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-white/10 px-4 py-6 text-center text-xs text-slate-600">{text}</p>;
}

function ProofEditor({ values, onChange }: { values: PortfolioProject["proof"]; onChange: (value: PortfolioProject["proof"]) => void }) {
  return (
    <section className={panelClass}>
      <SectionHeading title="Proof points" detail="Use only verified numbers or concrete system signals." />
      <div className="space-y-3">
        {values.map((proof, index) => (
          <div key={`${index}-${proof.value}`} className="grid gap-3 rounded-lg border border-white/[0.07] p-3 md:grid-cols-[150px_1fr_38px]">
            <input aria-label="Proof value" value={proof.value} onChange={(event) => onChange(values.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} placeholder="27K+" className={inputClass} />
            <input aria-label="Proof label" value={proof.label} onChange={(event) => onChange(values.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} placeholder="properties tracked" className={inputClass} />
            <RemoveButton onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} />
          </div>
        ))}
        {!values.length && <EmptyRow text="No proof points yet." />}
      </div>
      <AddButton onClick={() => onChange([...values, { value: "", label: "" }])}>Add proof point</AddButton>
    </section>
  );
}

function ArchitectureEditor({ values, onChange }: { values: ProjectArchitectureStage[]; onChange: (value: ProjectArchitectureStage[]) => void }) {
  function update(index: number, patch: Partial<ProjectArchitectureStage>) {
    onChange(values.map((stage, stageIndex) => stageIndex === index ? { ...stage, ...patch } : stage));
  }
  return (
    <section className={panelClass}>
      <SectionHeading title="Production architecture" detail="Each stage becomes a node in the project knowledge graph and a step in the architecture narrative." />
      <div className="space-y-3">
        {values.map((stage, index) => (
          <div key={`${index}-${stage.label}`} className="rounded-lg border border-white/[0.07] p-4">
            <div className="mb-3 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#d8ff3e]">Stage {String(index + 1).padStart(2, "0")}</span><RemoveButton onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} /></div>
            <div className="grid gap-3 md:grid-cols-[180px_1fr]">
              <Field label="Label"><input value={stage.label} onChange={(event) => update(index, { label: event.target.value })} className={inputClass} /></Field>
              <Field label="Title"><input value={stage.title} onChange={(event) => update(index, { title: event.target.value })} className={inputClass} /></Field>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_280px]">
              <Field label="Detail"><textarea rows={3} value={stage.detail} onChange={(event) => update(index, { detail: event.target.value })} className={inputClass} /></Field>
              <Field label="Technologies"><textarea rows={3} value={stage.technologies.join(", ")} onChange={(event) => update(index, { technologies: listFromText(event.target.value) })} className={inputClass} /></Field>
            </div>
          </div>
        ))}
        {!values.length && <EmptyRow text="No architecture stages yet." />}
      </div>
      <AddButton onClick={() => onChange([...values, { label: "", title: "", detail: "", technologies: [] }])}>Add architecture stage</AddButton>
    </section>
  );
}

function NotesEditor({ values, onChange }: { values: PortfolioProject["engineeringNotes"]; onChange: (value: PortfolioProject["engineeringNotes"]) => void }) {
  return (
    <section className={panelClass}>
      <SectionHeading title="Engineering decisions" detail="Capture the technical judgment behind the implementation." />
      <div className="space-y-3">
        {values.map((note, index) => (
          <div key={`${index}-${note.title}`} className="grid gap-3 rounded-lg border border-white/[0.07] p-3 md:grid-cols-[.7fr_1.3fr_38px]">
            <input aria-label="Decision title" value={note.title} onChange={(event) => onChange(values.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} placeholder="Decision title" className={inputClass} />
            <textarea aria-label="Decision detail" rows={2} value={note.detail} onChange={(event) => onChange(values.map((item, itemIndex) => itemIndex === index ? { ...item, detail: event.target.value } : item))} placeholder="Why this engineering choice matters" className={inputClass} />
            <RemoveButton onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} />
          </div>
        ))}
        {!values.length && <EmptyRow text="No engineering decisions yet." />}
      </div>
      <AddButton onClick={() => onChange([...values, { title: "", detail: "" }])}>Add engineering decision</AddButton>
    </section>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 hover:border-[#d8ff3e]/35 hover:text-white"><Plus size={14} /> {children}</button>;
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-label="Remove item" className="grid size-[38px] place-items-center self-start rounded-lg text-slate-600 hover:bg-red-500/10 hover:text-red-400"><Trash2 size={15} /></button>;
}
