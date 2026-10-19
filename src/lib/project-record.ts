import type { Prisma, Project } from "@/generated/prisma/client";
import type { PortfolioProject } from "@/data/projects";

type ProjectWrite = Omit<Prisma.ProjectUncheckedCreateInput, "id" | "createdAt" | "updatedAt">;

const DEFAULT_IMAGE = "/projects/project-system.svg";

function cleanText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function nullableText(value: unknown) {
  const text = cleanText(value);
  return text || null;
}

function textList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanText(item)).filter(Boolean);
}

function compactDescription(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= 190) return normalized;
  return `${normalized.slice(0, 187).trimEnd()}…`;
}

function proofList(value: unknown): PortfolioProject["proof"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const proof = { value: cleanText(record.value), label: cleanText(record.label) };
      return proof.value && proof.label ? proof : null;
    })
    .filter((item): item is PortfolioProject["proof"][number] => Boolean(item));
}

function architectureList(value: unknown): PortfolioProject["architecture"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const stage = {
        label: cleanText(record.label),
        title: cleanText(record.title),
        detail: cleanText(record.detail),
        technologies: textList(record.technologies),
      };
      return stage.label && stage.title && stage.detail ? stage : null;
    })
    .filter((item): item is PortfolioProject["architecture"][number] => Boolean(item));
}

function engineeringNotes(value: unknown): PortfolioProject["engineeringNotes"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const note = { title: cleanText(record.title), detail: cleanText(record.detail) };
      return note.title && note.detail ? note : null;
    })
    .filter((item): item is PortfolioProject["engineeringNotes"][number] => Boolean(item));
}

export function normalizeProjectInput(input: unknown): ProjectWrite {
  const record = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const title = cleanText(record.title);
  const slug = cleanText(record.slug).toLowerCase();
  const description = cleanText(record.description);

  if (!title) throw new Error("Project title is required");
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Slug must contain lowercase letters, numbers, and single hyphens only");
  }
  if (!description) throw new Error("Project description is required");

  const liveUrl = nullableText(record.liveUrl);
  const image = nullableText(record.image) || DEFAULT_IMAGE;
  const techStack = textList(record.techStack);
  const capabilities = textList(record.capabilities);
  const suppliedArchitecture = architectureList(record.architecture);
  const architecture = suppliedArchitecture.length ? suppliedArchitecture : [
    {
      label: "Input",
      title: "Define the system input",
      detail: "The workflow begins with an explicit user, event, document, or service input and validates the state required for processing.",
      technologies: techStack.slice(0, 2),
    },
    {
      label: "Process",
      title: "Execute the core workflow",
      detail: "Domain logic coordinates the central transformation, automation, reasoning, or product operation behind the system.",
      technologies: techStack.slice(2, 4),
    },
    {
      label: "Integrate",
      title: "Cross explicit service boundaries",
      detail: "External APIs, storage, model providers, and platform services remain behind controlled integration boundaries.",
      technologies: techStack.slice(4, 6),
    },
    {
      label: "Deliver",
      title: "Return an actionable result",
      detail: "The system produces a user-facing response, structured dataset, automated operation, or inspectable product outcome.",
      technologies: techStack.slice(6, 8),
    },
  ];
  const notes = engineeringNotes(record.engineeringNotes);

  return {
    slug,
    title,
    kicker: cleanText(record.kicker, "Engineering system / reviewed architecture"),
    description,
    shortDescription: cleanText(record.shortDescription) || compactDescription(description),
    category: cleanText(record.category, "Engineering System"),
    role: cleanText(record.role, "Product and systems engineering"),
    period: cleanText(record.period, "Documented"),
    status: record.status === "Live" || liveUrl ? "Live" : "Documented",
    liveUrl,
    githubUrl: nullableText(record.githubUrl),
    image,
    imageAlt: cleanText(record.imageAlt) || `${title} system architecture`,
    featured: Boolean(record.featured),
    published: record.published !== false,
    sortOrder: Number.isFinite(Number(record.sortOrder)) ? Number(record.sortOrder) : 0,
    techStack,
    proof: proofList(record.proof),
    challenge: cleanText(record.challenge) || description,
    system: cleanText(record.system) || description,
    outcome: cleanText(record.outcome) || "The system is represented in the reviewed portfolio archive.",
    capabilities: capabilities.length ? capabilities : [
      "Defined input and validation boundary",
      "Maintainable core workflow",
      "Explicit integration contracts",
      "Inspectable delivery outcome",
    ],
    architecture,
    engineeringNotes: notes.length ? notes : [
      {
        title: "Boundaries stay explicit",
        detail: "Inputs, core processing, integrations, and outcomes are separated so the system remains legible and maintainable.",
      },
    ],
    verification: cleanText(record.verification, "Project record maintained through the portfolio CMS"),
  };
}

export function projectToRecord(project: PortfolioProject): ProjectWrite {
  return normalizeProjectInput(project);
}

export function recordToProject(project: Project): PortfolioProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    kicker: project.kicker,
    description: project.description,
    shortDescription: project.shortDescription,
    category: project.category,
    role: project.role,
    period: project.period,
    status: project.status === "Live" ? "Live" : "Documented",
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    image: project.image || DEFAULT_IMAGE,
    imageAlt: project.imageAlt,
    featured: project.featured,
    published: project.published,
    sortOrder: project.sortOrder,
    techStack: project.techStack,
    proof: proofList(project.proof),
    challenge: project.challenge,
    system: project.system,
    outcome: project.outcome,
    capabilities: project.capabilities,
    architecture: architectureList(project.architecture),
    engineeringNotes: engineeringNotes(project.engineeringNotes),
    verification: project.verification,
  };
}
