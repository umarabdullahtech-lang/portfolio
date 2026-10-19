import catalog1 from "./project-catalog-1.generated.json";
import catalog2 from "./project-catalog-2.generated.json";
import catalog3 from "./project-catalog-3.generated.json";
import catalog4 from "./project-catalog-4.generated.json";
import catalog5 from "./project-catalog-5.generated.json";
import catalog6 from "./project-catalog-6.generated.json";

export type ProjectArchitectureStage = {
  label: string;
  title: string;
  detail: string;
  technologies: string[];
};

export type PortfolioProject = {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  description: string;
  shortDescription: string;
  category: string;
  role: string;
  period: string;
  status: "Live" | "Documented";
  liveUrl: string | null;
  githubUrl: string | null;
  image: string;
  imageAlt: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  techStack: string[];
  proof: Array<{ value: string; label: string }>;
  challenge: string;
  system: string;
  outcome: string;
  capabilities: string[];
  architecture: ProjectArchitectureStage[];
  engineeringNotes: Array<{ title: string; detail: string }>;
  verification: string;
};

const curatedPortfolioProjects: Omit<PortfolioProject, "published">[] = [
  {
    id: "jhb-property",
    slug: "jhb-property-intelligence",
    title: "JHB Property Intelligence",
    kicker: "Decision intelligence for real-estate underwriting",
    description:
      "A production deal-evaluation system that turns historical MLS data and active listings into explainable investment decisions, ARV estimates, target buy prices, and ranked opportunities.",
    shortDescription:
      "MLS ingestion, market-model training, three-stage deal scoring, AI enrichment, maps, watchlists, and export in one operating system.",
    category: "Decision Intelligence",
    role: "Core pipeline, scoring, AI, and product engineering",
    period: "2026",
    status: "Live",
    liveUrl: "https://intelligense.marketlytics.co.uk/",
    githubUrl: null,
    image: "/projects/jhb-property.png",
    imageAlt: "Jenkins Property Intelligence production sign-in screen",
    featured: true,
    sortOrder: 1,
    techStack: ["Next.js", "Node.js", "Express", "MySQL", "Anthropic", "OpenAI", "Google Sheets", "Docker"],
    proof: [
      { value: "44", label: "markets represented in the live product" },
      { value: "27K+", label: "properties tracked in the live product" },
      { value: "3", label: "separate decision engines" },
    ],
    challenge:
      "Raw MLS exports are inconsistent, duplicate-prone, and weak evidence for an investment decision. The system had to normalize property identity, learn local market behavior, select defensible comparables, and still explain every recommendation to a human underwriter.",
    system:
      "The platform separates historical training from active scoring. Historical sales are streamed, normalized, paired into flips, filtered for contamination, and aggregated into ZIP, county, and global models. Active listings then pass through factual guardrails, market valuation, and deal economics before AI services enrich remarks, condition, rehab range, and the final narrative.",
    outcome:
      "Investors receive a ranked, inspectable pipeline instead of another spreadsheet. Every Pursue, Underwrite, Watch, or Reject decision retains its run, model, comparables, assumptions, feedback, and export trail.",
    capabilities: [
      "Streaming MLS CSV ingestion with resumable run state",
      "Property identity resolution and historical flip detection",
      "ZIP, county, and global market-model training",
      "Comparable selection, ARV, rehab, and target-buy analysis",
      "Three-engine scoring with human-readable reason codes",
      "LLM-assisted remarks analysis with a persistent cache",
      "Map search, saved views, watchlists, and review feedback",
      "Google Sheets export and server-sent progress updates",
    ],
    architecture: [
      {
        label: "Acquire",
        title: "MLS data enters as an auditable run",
        detail: "Master and active CSV uploads are parsed as streams, content-hashed, normalized, and attached to cancellable pipeline runs.",
        technologies: ["Express", "Papa Parse", "SSE"],
      },
      {
        label: "Learn",
        title: "Historical behavior becomes local market models",
        detail: "Identity resolution, flip pairing, contamination filters, and aggregations build evidence at ZIP, county, and global levels.",
        technologies: ["Node.js", "MySQL", "Market models"],
      },
      {
        label: "Value",
        title: "Active listings receive defensible comparables",
        detail: "Geographic, property-class, recency, and quality gates select comps before calculating ARV and rehab-sensitive economics.",
        technologies: ["Comp engine", "Geospatial filters", "ARV"],
      },
      {
        label: "Decide",
        title: "Three engines separate facts, market, and deal fit",
        detail: "Truth checks, market-model output, and configurable investor thresholds combine into a reasoned investment disposition.",
        technologies: ["Engine 1", "Engine 2", "Engine 3"],
      },
      {
        label: "Explain",
        title: "AI enrichment stays behind deterministic controls",
        detail: "Anthropic and OpenAI enrich property condition, remarks, rehab range, and narrative while schemas and cache boundaries contain variance.",
        technologies: ["Anthropic", "OpenAI", "JSON schemas"],
      },
      {
        label: "Operate",
        title: "Review, feedback, and export close the loop",
        detail: "The Next.js console exposes maps, watchlists, saved views, configurations, verification queues, and Google Sheets delivery.",
        technologies: ["Next.js", "Google Sheets", "Docker"],
      },
    ],
    engineeringNotes: [
      { title: "Deterministic before generative", detail: "Core valuation and deal gates remain inspectable code. Models add context and narrative, not unbounded authority." },
      { title: "Configuration is versioned state", detail: "Scorer and active-listing configurations can be drafted, promoted, archived, and tied back to individual runs." },
      { title: "Feedback is product data", detail: "Reviewer decisions, exclusions, overrides, and verifier lessons feed the next model and rule iteration." },
    ],
    verification: "Live product and source reviewed on 2026-07-16",
  },
  {
    id: "jorge-castro",
    slug: "jorge-castro-ai",
    title: "AI Visibility Platform",
    kicker: "A queue-backed AI visibility and content platform",
    description:
      "A multi-surface SaaS platform for AI search visibility, SEO intelligence, content production, rank tracking, reporting, and automated publishing across customer sites.",
    shortDescription:
      "Model routing, research, queues, content generation, AI visibility, reporting, and publishing coordinated as a production platform.",
    category: "AI SaaS Platform",
    role: "Core platform and AI workflow engineering",
    period: "2025-2026",
    status: "Live",
    liveUrl: "https://telesales.jorgecastro.ai/",
    githubUrl: null,
    image: "/projects/project-system.svg",
    imageAlt: "AI Visibility Platform system architecture",
    featured: true,
    sortOrder: 2,
    techStack: ["Next.js", "Node.js", "LangChain", "OpenAI", "Anthropic", "Gemini", "Redis", "MySQL", "Playwright", "Docker"],
    proof: [
      { value: "4", label: "product surfaces in one repository" },
      { value: "3+", label: "commercial model providers routed" },
      { value: "24/7", label: "scheduled automation design" },
    ],
    challenge:
      "AI SEO is not a single prompt. It combines live search evidence, brand context, content strategy, generation, publishing, rank monitoring, citations, billing, and long-running jobs that must survive provider and browser failures.",
    system:
      "The platform uses separate web, telesales, desktop, and API surfaces over a shared Express core. Bull and Redis coordinate long-running work, sockets expose progress, Playwright and search services gather evidence, and a provider-neutral LLM layer routes work across OpenAI, Anthropic, Gemini, Azure, and compatible models.",
    outcome:
      "A single brand workspace can move from discovery to production: analyze visibility, build a keyword universe, generate content and imagery, publish to connected sites, track traditional and AI search presence, and receive scheduled reports.",
    capabilities: [
      "AI visibility, citation verification, and overview tracking",
      "Keyword-universe, competitor, trend, and rank research",
      "Single and bulk content generation with image workflows",
      "Provider-neutral LLM routing with tools and cost estimation",
      "Bull and Redis job orchestration with live socket progress",
      "Brand settings, credits, subscriptions, teams, and permissions",
      "WordPress and ecommerce publishing integrations",
      "Weekly and monthly report generation and delivery",
    ],
    architecture: [
      {
        label: "Workspace",
        title: "Brand intent enters through dedicated product surfaces",
        detail: "Next.js web, telesales, admin, and desktop clients share identity, brand configuration, credits, and workflow state.",
        technologies: ["Next.js", "NextAuth", "Socket.IO"],
      },
      {
        label: "Research",
        title: "Search evidence grounds every automation",
        detail: "SERP, DataForSEO, browser crawling, site audits, trend data, and competitor discovery assemble the working context.",
        technologies: ["Playwright", "Cheerio", "DataForSEO"],
      },
      {
        label: "Orchestrate",
        title: "Long-running work moves through durable queues",
        detail: "Bull, Redis, cron controls, and worker processes isolate retries, scheduling, cancellation, progress, and operational visibility.",
        technologies: ["Bull", "Redis", "Workers"],
      },
      {
        label: "Reason",
        title: "A shared model layer routes by task and provider",
        detail: "OpenAI, Anthropic, Gemini, Azure, and compatible endpoints expose streaming, structured output, tools, imagery, and cost estimation.",
        technologies: ["LangChain", "OpenAI", "Anthropic", "Gemini"],
      },
      {
        label: "Publish",
        title: "Generated assets cross a controlled integration boundary",
        detail: "Content, SEO metadata, products, categories, and media are delivered through connected WordPress and commerce adapters.",
        technologies: ["WordPress REST", "S3", "Google Cloud"],
      },
      {
        label: "Measure",
        title: "Traditional and AI search signals return to the workspace",
        detail: "Rank trackers, citation checks, visibility history, automation logs, and scheduled PDF reports create the operating feedback loop.",
        technologies: ["MySQL", "Trackers", "Reporting"],
      },
    ],
    engineeringNotes: [
      { title: "One platform, many execution modes", detail: "Interactive requests, bulk runs, schedules, background workers, and socket sessions use the same domain services." },
      { title: "Provider choice is a runtime concern", detail: "Model selection and tool binding sit behind a shared interface so workflows can evolve without hard-coding one vendor." },
      { title: "Operations are visible", detail: "Queue controls, automation logs, costs, credits, reports, and retry paths are part of the product surface." },
    ],
    verification: "Live product and source reviewed on 2026-07-16",
  },
  {
    id: "jorge-chatbot",
    slug: "jorge-chatbot",
    title: "Grounded AI Chatbot",
    kicker: "Multi-model RAG with an embeddable delivery layer",
    description:
      "A white-label conversational AI platform that ingests business knowledge, evaluates retrieval quality, generates grounded answers, and delivers them through hosted chat and an embeddable website widget.",
    shortDescription:
      "Document ingestion, retrieval grading, multi-model generation, conversation operations, billing, and a distributable chat widget.",
    category: "Conversational AI",
    role: "AI pipeline and product engineering",
    period: "2025-2026",
    status: "Live",
    liveUrl: "https://bot.jorgecastro.ai/",
    githubUrl: null,
    image: "/projects/project-system.svg",
    imageAlt: "Grounded AI Chatbot system architecture",
    featured: true,
    sortOrder: 3,
    techStack: ["Next.js", "Express", "LangChain", "LangGraph", "OpenAI", "Anthropic", "Gemini", "Pinecone", "MySQL", "Docker"],
    proof: [
      { value: "3", label: "model families available" },
      { value: "6+", label: "knowledge-source formats" },
      { value: "2", label: "hosted and embedded delivery modes" },
    ],
    challenge:
      "A production chatbot must manage source ingestion, retrieval quality, prompt behavior, conversation history, feedback, lead capture, tenant settings, and billing while keeping the end-user interaction fast and brand-consistent.",
    system:
      "Files, websites, sitemaps, YouTube, audio, and text pass through dedicated extraction services before storage and vector indexing. Questions are analyzed, conditionally retrieved, graded for relevance, and generated through a multi-provider model layer. MySQL retains operational state while Pinecone carries semantic memory.",
    outcome:
      "Teams can create, train, style, deploy, and inspect a chatbot from one product. The same knowledge and policy layer powers the hosted experience, API, and copy-paste website bubble.",
    capabilities: [
      "PDF, document, web, sitemap, YouTube, audio, and text ingestion",
      "S3 and Google Cloud source storage",
      "Pinecone vector indexing and semantic retrieval",
      "Question analysis, retrieval decisions, and document grading",
      "OpenAI, Gemini, and Anthropic model support",
      "Conversation history, reviews, and QA refinement",
      "Appearance, access, leads, prompt, and source controls",
      "Stripe billing, Docker services, nginx, and embed widget",
    ],
    architecture: [
      {
        label: "Configure",
        title: "Each bot gets its own behavior and brand boundary",
        detail: "The Next.js console manages sources, prompts, appearance, access rules, lead settings, inbox, and deployment options.",
        technologies: ["Next.js", "NextAuth", "MySQL"],
      },
      {
        label: "Ingest",
        title: "Heterogeneous sources become a common knowledge format",
        detail: "Dedicated services extract documents, websites, sitemaps, YouTube, audio, and text before durable storage and chunking.",
        technologies: ["Cheerio", "AWS S3", "Google Cloud"],
      },
      {
        label: "Index",
        title: "Chunks become tenant-scoped semantic memory",
        detail: "Embeddings and source metadata are written to Pinecone with lifecycle utilities for refresh and deletion.",
        technologies: ["LangChain", "Pinecone", "Embeddings"],
      },
      {
        label: "Evaluate",
        title: "The graph decides when retrieval is worth using",
        detail: "Question analysis, retrieve decisions, document grading, and no-data paths reduce unsupported answers before generation.",
        technologies: ["LangGraph", "Graders", "Routing"],
      },
      {
        label: "Generate",
        title: "Models answer within the bot policy and retrieved context",
        detail: "OpenAI, Gemini, and Anthropic providers generate responses while conversation history and user feedback remain inspectable.",
        technologies: ["OpenAI", "Gemini", "Anthropic"],
      },
      {
        label: "Deliver",
        title: "One backend serves hosted chat and website embeds",
        detail: "The hosted product, generic API, and bundled bubble share the same bot configuration behind nginx and Docker Compose.",
        technologies: ["Express", "Embed bundle", "Docker"],
      },
    ],
    engineeringNotes: [
      { title: "Retrieval is a decision", detail: "The flow can analyze, retrieve, grade, generate, or take an explicit no-data path instead of blindly stuffing context." },
      { title: "Ingestion has its own service boundary", detail: "Media conversion and source extraction can scale or fail independently from the interactive chat path." },
      { title: "White-labeling reaches behavior", detail: "Appearance is only one layer. Access, prompts, lead rules, model settings, and sources are tenant-controlled." },
    ],
    verification: "Live product and source reviewed on 2026-07-16",
  },
  {
    id: "jorge-castro-wp-plugin",
    slug: "jorge-castro-wordpress-bridge",
    title: "WordPress AI Publishing Bridge",
    kicker: "A secure publishing plane between SaaS and WordPress",
    description:
      "A production WordPress plugin that lets an AI SaaS platform manage content, WooCommerce catalog data, authors, categories, and SEO metadata through a versioned authenticated REST API.",
    shortDescription:
      "Versioned API-key authentication, WordPress and WooCommerce handlers, SEO metadata adapters, and controlled remote publishing.",
    category: "Platform Integration",
    role: "Plugin architecture and integration engineering",
    period: "2026",
    status: "Live",
    liveUrl: "https://saas.jorgecastro.ai/",
    githubUrl: null,
    image: "/projects/project-system.svg",
    imageAlt: "WordPress AI Publishing Bridge system architecture",
    featured: true,
    sortOrder: 4,
    techStack: ["PHP", "WordPress", "WooCommerce", "REST API", "Yoast SEO", "Rank Math", "JavaScript"],
    proof: [
      { value: "1", label: "versioned integration namespace" },
      { value: "6", label: "content-domain handler groups" },
      { value: "2", label: "SEO metadata providers supported" },
    ],
    challenge:
      "Remote publishing must work across heterogeneous WordPress installations, optional WooCommerce and SEO plugins, restrictive security plugins, and sites where the REST API may be disabled. The integration also needs strict authentication and safe content ownership semantics.",
    system:
      "The plugin registers a versioned REST namespace, authenticates requests with a constant-time API-key comparison or an administrator capability, then routes operations to focused handlers for authors, pages, posts, products, categories, and SEO metadata. Connection lifecycle and REST recovery remain explicit administrator actions.",
    outcome:
      "The SaaS can publish and maintain structured content across customer sites without sharing WordPress credentials or coupling platform workflows to WordPress internals.",
    capabilities: [
      "Connect and disconnect lifecycle with API-key registration",
      "Constant-time API-key authorization and admin fallback",
      "Bulk post creation, update, deletion, and attribution",
      "Page and custom post-type content management",
      "WooCommerce product and category operations",
      "Yoast SEO and Rank Math metadata read and write",
      "Author creation, assignment, search, and deletion",
      "Targeted REST recovery for common blocker plugins",
    ],
    architecture: [
      {
        label: "Connect",
        title: "An administrator establishes the trust boundary",
        detail: "The plugin registers its base URL and webhook with the SaaS, then retains the shared API key in WordPress configuration.",
        technologies: ["WordPress Admin", "HTTPS", "API key"],
      },
      {
        label: "Authorize",
        title: "Every request is checked before routing",
        detail: "The permission callback accepts a constant-time X-API-Key match or a logged-in administrator with manage_options capability.",
        technologies: ["hash_equals", "WP capabilities", "REST"],
      },
      {
        label: "Route",
        title: "A versioned namespace protects the public API contract",
        detail: "The versioned plugin namespace dispatches connection, author, post, page, product, category, metadata, and log operations.",
        technologies: ["WP REST API", "JSON", "Postman"],
      },
      {
        label: "Mutate",
        title: "Domain handlers translate SaaS intent into WordPress operations",
        detail: "Focused classes apply validation and map payloads to posts, taxonomies, users, WooCommerce objects, and media.",
        technologies: ["PHP", "WordPress", "WooCommerce"],
      },
      {
        label: "Optimize",
        title: "SEO metadata reaches the active provider",
        detail: "The adapter reads and writes the correct Yoast SEO or Rank Math fields for pages, posts, and products.",
        technologies: ["Yoast SEO", "Rank Math", "Post meta"],
      },
      {
        label: "Recover",
        title: "Site-level blockers can be handled without opening everything",
        detail: "The plugin always preserves its own namespace and provides an administrator-controlled recovery path for known REST blockers.",
        technologies: ["WP filters", "Admin controls", "Logs"],
      },
    ],
    engineeringNotes: [
      { title: "Least privilege by default", detail: "The SaaS receives a narrow versioned API rather than a WordPress account or unrestricted application password." },
      { title: "Optional plugins stay optional", detail: "WooCommerce, Yoast, and Rank Math are detected at runtime and handled behind separate adapters." },
      { title: "Operations remain reversible", detail: "Connection state, force-enable behavior, generated-content filters, and uninstall cleanup are explicit." },
    ],
    verification: "Live SaaS surface and plugin source reviewed on 2026-07-16",
  },
  {
    id: "booku",
    slug: "book-umrah-today",
    title: "Book Umrah Today",
    kicker: "Travel discovery and booking for a high-trust journey",
    description:
      "A full-stack travel product for discovering Umrah packages, hotels, flights, and combined itineraries with guided search, multi-currency context, booking support, and editorial content.",
    shortDescription:
      "A responsive package-discovery and booking journey backed by customer, content, support, payment, and media services.",
    category: "Travel Commerce",
    role: "Full-stack product delivery",
    period: "Production",
    status: "Live",
    liveUrl: "https://bookumrahtoday.com/",
    githubUrl: null,
    image: "/projects/booku.png",
    imageAlt: "Book Umrah Today live package-search homepage",
    featured: false,
    sortOrder: 5,
    techStack: ["Next.js", "React", "Express", "MySQL", "Stripe", "AWS S3", "Docker", "nginx"],
    proof: [
      { value: "4", label: "travel search modes" },
      { value: "2", label: "responsive booking experiences" },
      { value: "1", label: "integrated content and support system" },
    ],
    challenge:
      "Pilgrimage travel combines emotional trust with dense logistics. The experience had to coordinate origin, destination, dates, stay length, party composition, cabin class, currency, and package context without turning the first interaction into a form wall.",
    system:
      "The Next.js experience provides dedicated flows for Umrah-only packages, Umrah holidays, hotels, and flight-plus-hotel discovery. Express services handle customers, authentication, support, blog content, payment events, and media while MySQL and S3 preserve operational state and assets.",
    outcome:
      "Visitors can move from inspiration to a concrete booking inquiry through one consistent desktop and mobile journey, with editorial guidance and WhatsApp support close at hand.",
    capabilities: [
      "Umrah-only, holiday, hotel, and flight-plus-hotel search modes",
      "Date, duration, traveler, cabin, and destination controls",
      "Responsive mobile booking flow and persistent footer actions",
      "Package merchandising and destination discovery",
      "Multi-currency context and customer authentication",
      "Editorial guide, FAQ, blog, and admin publishing",
      "Support workflows and WhatsApp contact path",
      "Stripe events, MySQL persistence, S3 media, and Docker deployment",
    ],
    architecture: [
      {
        label: "Discover",
        title: "Visitors choose the trip shape before the details",
        detail: "The interface separates package, holiday, hotel, and combined travel modes so each flow asks only relevant questions.",
        technologies: ["Next.js", "React", "Responsive UI"],
      },
      {
        label: "Compose",
        title: "Travel context becomes a structured booking intent",
        detail: "Locations, dates, nights, travelers, rooms, cabin class, and currency are normalized into a consistent request.",
        technologies: ["Form state", "Date ranges", "Currency context"],
      },
      {
        label: "Serve",
        title: "Application services own customer and content workflows",
        detail: "Express routes separate users, support, blog publishing, verification, password recovery, and payment operations.",
        technologies: ["Express", "JWT", "Email"],
      },
      {
        label: "Persist",
        title: "Relational state and media use dedicated stores",
        detail: "MySQL retains accounts and operational records while AWS S3 carries uploaded editorial and product imagery.",
        technologies: ["MySQL", "AWS S3", "Uploads"],
      },
      {
        label: "Convert",
        title: "Booking and support actions remain close to discovery",
        detail: "Package cards, booking popups, contact paths, payment callbacks, and WhatsApp support turn research into an assisted next step.",
        technologies: ["Stripe", "WhatsApp", "Support API"],
      },
      {
        label: "Deploy",
        title: "Web, API, and proxy ship as isolated services",
        detail: "Docker Compose and nginx define repeatable boundaries for the Next.js client and Express server.",
        technologies: ["Docker", "nginx", "Health checks"],
      },
    ],
    engineeringNotes: [
      { title: "Progressive disclosure", detail: "Travel modes isolate complexity so the user sees the fields required for the journey they actually selected." },
      { title: "Content supports conversion", detail: "Guides, packages, FAQs, testimonials, and support are part of the same application instead of detached campaign pages." },
      { title: "Mobile has a dedicated interaction model", detail: "Traveler, dates, destinations, stays, and cabin controls use mobile-specific panels instead of compressed desktop widgets." },
    ],
    verification: "Live product and source reviewed on 2026-07-16",
  },
  {
    id: "client-chatbot",
    slug: "atlee-chat",
    title: "Atlee Chat",
    kicker: "A white-label knowledge assistant for service teams",
    description:
      "A deployed conversational AI product for creating branded assistants, training them on private sources, handling customer conversations, and managing feedback, leads, access, and subscription state.",
    shortDescription:
      "A tenant-configurable RAG product with multi-source ingestion, grounded chat, embeddable delivery, operational inboxes, and billing.",
    category: "White-label AI",
    role: "Full-stack AI product delivery",
    period: "Production",
    status: "Live",
    liveUrl: "https://sats.marketlytics.co.uk/",
    githubUrl: null,
    image: "/projects/client-chatbot.png",
    imageAlt: "Atlee Chat production sign-in screen",
    featured: false,
    sortOrder: 6,
    techStack: ["Next.js", "Express", "LangChain", "LangGraph", "Pinecone", "MySQL", "AWS S3", "Stripe", "Docker"],
    proof: [
      { value: "6+", label: "supported knowledge-source types" },
      { value: "4", label: "separate deployable services" },
      { value: "1", label: "tenant-controlled assistant lifecycle" },
    ],
    challenge:
      "Service organizations need more than a chat window. They need controlled knowledge ingestion, grounded answers, conversation review, brand and access settings, lead capture, source refresh, and a safe way to distribute the assistant across web properties.",
    system:
      "A Next.js management surface coordinates an Express application API and a separate generic AI service. Source-specific controllers handle documents, websites, sitemaps, YouTube, audio, and text before vectorization. LangGraph utilities analyze questions, choose retrieval, grade context, and generate a response.",
    outcome:
      "A team can move through the full assistant lifecycle from account and subscription to source training, QA refinement, deployment, inbox review, feedback, and ongoing configuration.",
    capabilities: [
      "Tenant accounts, authentication, roles, and subscriptions",
      "Bot creation, update, access, lead, and appearance settings",
      "Document, web, sitemap, YouTube, audio, and text ingestion",
      "Pinecone retrieval with question and document grading",
      "Multi-provider generation through LangChain and LangGraph",
      "Conversation history, review, likes, and QA refinement",
      "Hosted chat, generic API, and bundled website widget",
      "Stripe, S3, MySQL, Docker Compose, and nginx operations",
    ],
    architecture: [
      {
        label: "Manage",
        title: "The tenant console owns the assistant lifecycle",
        detail: "Accounts, plans, bots, sources, prompt documentation, appearance, access, leads, inbox, and analytics share one product surface.",
        technologies: ["Next.js", "Redux", "NextAuth"],
      },
      {
        label: "Extract",
        title: "Source-specific services remove format differences",
        detail: "Files, URLs, sitemaps, YouTube, audio, and text each enter through dedicated routes and extraction controllers.",
        technologies: ["Cheerio", "PDF", "Audio processing"],
      },
      {
        label: "Store",
        title: "Objects, vectors, and operational state stay separate",
        detail: "S3 or Google Cloud stores source objects, Pinecone stores semantic chunks, and MySQL retains product and conversation state.",
        technologies: ["AWS S3", "Pinecone", "MySQL"],
      },
      {
        label: "Reason",
        title: "A graph evaluates context before answering",
        detail: "Question analysis, retrieval decisions, document grading, response generation, and no-data handling form an explicit path.",
        technologies: ["LangGraph", "LangChain", "Model APIs"],
      },
      {
        label: "Observe",
        title: "Conversations return as inspectable product data",
        detail: "History, reviews, likes, bulk updates, inbox state, and refinement workflows let operators audit real interactions.",
        technologies: ["Conversation API", "Feedback", "Winston"],
      },
      {
        label: "Distribute",
        title: "Hosted and embedded experiences share one policy layer",
        detail: "The client, main API, generic service, and bundle build deploy behind nginx with a consistent bot configuration.",
        technologies: ["Embed bundle", "Docker", "nginx"],
      },
    ],
    engineeringNotes: [
      { title: "Source lifecycle matters", detail: "Create, refresh, retrieve, and delete paths keep object storage and vector state synchronized." },
      { title: "Operators can inspect failure", detail: "No-data paths, conversation history, reviews, and QA refinement expose behavior that would otherwise stay hidden." },
      { title: "Deployment is part of the product", detail: "The hosted interface and embeddable widget share tenant policy rather than diverging into separate chatbot implementations." },
    ],
    verification: "Live product and source reviewed on 2026-07-16",
  },
  {
    id: "dilpasand",
    slug: "dilpasand",
    title: "Dilpasand",
    kicker: "A hospitality platform built around experience and conversion",
    description:
      "A production restaurant experience for menu discovery, reservations, private dining, catering, editorial storytelling, galleries, location guidance, and customer communication.",
    shortDescription:
      "A cinematic public experience connected to reservation, content, customer, media, support, and payment services.",
    category: "Hospitality Platform",
    role: "Full-stack product delivery",
    period: "Production",
    status: "Live",
    liveUrl: "https://dilpasand.vercel.app/",
    githubUrl: null,
    image: "/projects/dilpasand.png",
    imageAlt: "Dilpasand live restaurant homepage",
    featured: false,
    sortOrder: 7,
    techStack: ["Next.js", "React", "Express", "MySQL", "AWS S3", "Stripe", "Docker", "nginx"],
    proof: [
      { value: "3", label: "conversion paths" },
      { value: "2", label: "content management surfaces" },
      { value: "1", label: "responsive hospitality system" },
    ],
    challenge:
      "A restaurant site must sell atmosphere without hiding practical intent. Menu, table booking, private dining, catering, location, and story all need distinct routes while content and reservations remain maintainable by operators.",
    system:
      "The Next.js client composes media-rich public routes with reservation forms, blog content, menus, maps, galleries, testimonials, newsletter, and analytics. Express services separate users, support, editorial content, payments, and persistence behind Docker and nginx boundaries.",
    outcome:
      "Guests can understand the brand, inspect the menu, plan a visit, request a table or group event, and continue into a direct communication path without leaving the product experience.",
    capabilities: [
      "Menu, story, gallery, media, and location experiences",
      "Table reservation and date-selection flows",
      "Private dining, group booking, and catering paths",
      "Blog publishing and protected administration",
      "Newsletter and transactional email workflows",
      "Customer accounts and support operations",
      "S3 media and MySQL application state",
      "Responsive delivery with Docker and nginx",
    ],
    architecture: [
      {
        label: "Attract",
        title: "Story, food, and atmosphere establish intent",
        detail: "Video, editorial sections, menu exploration, galleries, social media, testimonials, and location content build the public experience.",
        technologies: ["Next.js", "Media", "Analytics"],
      },
      {
        label: "Choose",
        title: "Different visit types get different conversion paths",
        detail: "Standard tables, private dining, group bookings, and catering preserve the fields and expectations of each request.",
        technologies: ["React forms", "Date controls", "Validation"],
      },
      {
        label: "Coordinate",
        title: "Application routes separate customer and operator work",
        detail: "Express controllers own users, support, editorial content, payment events, and reservation-adjacent workflows.",
        technologies: ["Express", "Authentication", "Email"],
      },
      {
        label: "Persist",
        title: "Operational records and media use the right stores",
        detail: "MySQL handles structured product state while AWS S3 stores uploaded visual and editorial assets.",
        technologies: ["MySQL", "AWS S3", "Multer"],
      },
      {
        label: "Operate",
        title: "Protected administration keeps the public surface current",
        detail: "Admin and blog tools let operators manage content and reservation data without code changes.",
        technologies: ["Admin UI", "Blog API", "Protected routes"],
      },
      {
        label: "Deploy",
        title: "Client, API, and proxy retain independent runtime boundaries",
        detail: "Containerized services and nginx support repeatable deployment and clear network ownership.",
        technologies: ["Docker", "nginx", "Vercel"],
      },
    ],
    engineeringNotes: [
      { title: "Atmosphere has a job", detail: "Media and motion support menu discovery and booking intent instead of acting as isolated decoration." },
      { title: "Conversion paths stay domain-specific", detail: "A group event is not forced through the same flow as a two-person reservation." },
      { title: "Operators own freshness", detail: "Editorial and administrative surfaces reduce the cost of keeping menus, stories, and customer-facing information current." },
    ],
    verification: "Live product and source reviewed on 2026-07-16",
  },
  {
    id: "jorge-site",
    slug: "jorge-castro-product-site",
    title: "AI Platform Product Site",
    kicker: "The multilingual front door to an AI SEO platform",
    description:
      "The public product and acquisition surface for an AI visibility platform, connecting multilingual marketing, product education, registration, pricing, analytics, and the authenticated SaaS experience.",
    shortDescription:
      "A multilingual product surface that translates a complex AI SEO platform into a clear acquisition, registration, and product-education journey.",
    category: "Product Experience",
    role: "Product ecosystem support and integration",
    period: "2026",
    status: "Live",
    liveUrl: "https://jorgecastro.ai/en",
    githubUrl: null,
    image: "/projects/project-system.svg",
    imageAlt: "AI Platform Product Site system architecture",
    featured: false,
    sortOrder: 8,
    techStack: ["Next.js", "React", "next-intl", "Express", "Redis", "MySQL", "Stripe", "Docker"],
    proof: [
      { value: "2+", label: "localized market experiences" },
      { value: "1", label: "public-to-product handoff" },
      { value: "0", label: "separate account systems" },
    ],
    challenge:
      "The public site has to explain an unusually broad platform without reproducing the application itself. It also needs localized content, clean registration and pricing paths, privacy controls, analytics, and a reliable transition into the authenticated product.",
    system:
      "A localized Next.js application owns the public experience and product education. It connects to shared Express services for dynamic platform concerns, uses Redis and MySQL for application state, and hands registration, subscriptions, and authenticated use into the wider AI product ecosystem.",
    outcome:
      "The platform presents one coherent promise from first visit through account creation while keeping the deeper AI visibility, content, tracking, and publishing capabilities discoverable.",
    capabilities: [
      "Localized navigation, content, metadata, and calls to action",
      "Product education for content, visibility, and AI workflows",
      "Pricing, registration, login, and account handoff",
      "Media, FAQ, policy, consent, and analytics surfaces",
      "Dynamic content and translation service integration",
      "Shared authentication and platform identity",
      "Stripe-aware subscription journey",
      "Docker and nginx production topology",
    ],
    architecture: [
      {
        label: "Localize",
        title: "Locale shapes routes, metadata, and product copy",
        detail: "next-intl provides market-specific navigation and content while preserving a shared component and SEO foundation.",
        technologies: ["Next.js", "next-intl", "Metadata"],
      },
      {
        label: "Explain",
        title: "Product capability becomes a navigable public narrative",
        detail: "AI, pricing, media, about, FAQ, and policy surfaces introduce the platform without exposing application complexity.",
        technologies: ["React", "Content", "Media"],
      },
      {
        label: "Convert",
        title: "Calls to action share one account and plan journey",
        detail: "Registration, login, and plan selection hand visitors into the shared platform identity rather than creating a parallel funnel.",
        technologies: ["Auth", "Stripe", "Shared accounts"],
      },
      {
        label: "Integrate",
        title: "Dynamic concerns cross an explicit API boundary",
        detail: "Express services support platform content, translation, customer state, and operational integrations behind the web surface.",
        technologies: ["Express", "Redis", "MySQL"],
      },
      {
        label: "Measure",
        title: "Consent-aware analytics closes the acquisition loop",
        detail: "Cookie controls and marketing integrations capture funnel signals while keeping privacy choices visible.",
        technologies: ["Analytics", "Meta Pixel", "Consent"],
      },
      {
        label: "Deploy",
        title: "The public site and API remain independently deployable",
        detail: "Docker Compose, nginx, and separate client and server images keep release and runtime boundaries clear.",
        technologies: ["Docker", "nginx", "CI/CD"],
      },
    ],
    engineeringNotes: [
      { title: "The public site is not a product clone", detail: "It explains jobs, evidence, and outcomes, then hands deeper interaction to the authenticated platform." },
      { title: "Localization reaches metadata", detail: "Routes, page copy, search presentation, and conversion language move together for each market." },
      { title: "Identity remains continuous", detail: "Marketing, registration, plan selection, and the SaaS application belong to one product ecosystem." },
    ],
    verification: "Live product and source reviewed on 2026-07-16",
  },
  {
    id: "autogpt",
    slug: "autogpt-platform-reference",
    title: "AutoGPT Platform",
    kicker: "An open-source reference architecture for composable AI agents",
    description:
      "A reviewed open-source platform for building, executing, and sharing block-based AI agents across a visual frontend, execution services, persistent state, and a public marketplace.",
    shortDescription:
      "An open-source systems reference covering graph-based agent composition, isolated execution, credentials, persistence, and marketplace distribution.",
    category: "Open-source Reference",
    role: "Architecture review and local platform evaluation",
    period: "Open source",
    status: "Live",
    liveUrl: "https://agpt.co/",
    githubUrl: "https://github.com/Significant-Gravitas/AutoGPT",
    image: "/projects/autogpt.png",
    imageAlt: "AutoGPT public product homepage",
    featured: false,
    sortOrder: 9,
    techStack: ["Next.js", "React Flow", "Python", "FastAPI", "Prisma", "PostgreSQL", "Redis", "Supabase", "Docker"],
    proof: [
      { value: "OSS", label: "upstream project reference" },
      { value: "3", label: "core platform planes" },
      { value: "1", label: "visual agent graph model" },
    ],
    challenge:
      "General-purpose agents need more than a prompt loop. A useful platform must compose reusable blocks, hold credentials safely, schedule and isolate executions, stream state back to users, persist graph versions, and make agents discoverable.",
    system:
      "The reviewed platform separates the Next.js graph builder, backend APIs, execution workers, database and authentication services, and marketplace. Agent graphs are stored as versioned structures and dispatched into an execution plane that resolves block dependencies and emits progress.",
    outcome:
      "The codebase is a strong reference for the boundaries required by a general agent platform: authoring, execution, state, credentials, observability, and distribution. It is included as a transparent open-source study, not as a personal authorship claim.",
    capabilities: [
      "Visual graph construction for reusable agent workflows",
      "Block registry for models, tools, data, and integrations",
      "Versioned agent definitions and execution state",
      "Credential and secret management boundaries",
      "Background execution with progress and result events",
      "PostgreSQL and Redis-backed platform services",
      "Agent marketplace and discovery surface",
      "Docker Compose development and deployment topology",
    ],
    architecture: [
      { label: "Compose", title: "Users assemble a typed agent graph", detail: "The Next.js interface and React Flow represent nodes, connections, settings, and reusable templates as a visual program.", technologies: ["Next.js", "React Flow", "TypeScript"] },
      { label: "Validate", title: "Graph contracts are checked before execution", detail: "Block definitions and connection rules establish the inputs, outputs, credentials, and dependency order needed by a run.", technologies: ["Block registry", "Schemas", "Graph validation"] },
      { label: "Dispatch", title: "The API converts a graph version into a run", detail: "Authenticated requests resolve the selected agent, execution context, secrets, and schedule before work reaches the execution plane.", technologies: ["FastAPI", "Auth", "Scheduling"] },
      { label: "Execute", title: "Workers traverse blocks and emit state", detail: "Independent executors run model, tool, data, and integration blocks while preserving node outputs and failure context.", technologies: ["Python", "Workers", "Events"] },
      { label: "Persist", title: "Platform state and fast coordination stay separate", detail: "PostgreSQL and Prisma retain durable entities while Redis supports coordination and transient execution concerns.", technologies: ["PostgreSQL", "Prisma", "Redis"] },
      { label: "Distribute", title: "Completed agents can move into a marketplace", detail: "The market surface packages metadata, versions, ownership, and discovery around reusable agent definitions.", technologies: ["Marketplace", "Supabase", "Docker"] },
    ],
    engineeringNotes: [
      { title: "Graphs are product contracts", detail: "A visual builder becomes reliable only when nodes expose typed boundaries and persisted versions." },
      { title: "Execution needs its own plane", detail: "Long-running agent work should not share lifecycle and failure behavior with the interactive web request." },
      { title: "Attribution stays explicit", detail: "This item documents an upstream open-source system reviewed locally and does not claim original authorship." },
    ],
    verification: "Public upstream product and local source copy reviewed on 2026-07-16; no personal authorship claim",
  },
  {
    id: "contribution",
    slug: "homepage-open-source-reference",
    title: "Homepage",
    kicker: "A declarative service dashboard for self-hosted infrastructure",
    description:
      "A reviewed open-source application dashboard that turns declarative configuration into a fast, proxied, service-aware homepage with broad widget and Docker integrations.",
    shortDescription:
      "An open-source reference for configuration-driven dashboards, service discovery, proxied integrations, localization, and container delivery.",
    category: "Open-source Reference",
    role: "Architecture review and local deployment evaluation",
    period: "Open source",
    status: "Live",
    liveUrl: "https://gethomepage.dev/",
    githubUrl: "https://github.com/gethomepage/homepage",
    image: "/projects/contribution.png",
    imageAlt: "Homepage open-source project documentation site",
    featured: false,
    sortOrder: 10,
    techStack: ["Next.js", "React", "Tailwind CSS", "YAML", "Docker", "Service APIs", "i18next"],
    proof: [
      { value: "OSS", label: "upstream project reference" },
      { value: "100+", label: "documented service integrations" },
      { value: "1", label: "declarative configuration model" },
    ],
    challenge:
      "A self-hosted homepage has to unify many unrelated services without exposing credentials to the browser or forcing users to build a custom dashboard. It also needs fast static delivery, Docker discovery, localization, and fault isolation when widgets fail.",
    system:
      "YAML configuration defines groups, services, bookmarks, widgets, and layout. Next.js renders the experience while server-side proxy routes protect integration credentials and normalize external APIs. Docker discovery can supplement or generate service definitions.",
    outcome:
      "The project demonstrates a clean configuration-to-interface pipeline and a practical pattern for safely aggregating heterogeneous infrastructure. It is included as a reviewed upstream reference with explicit attribution.",
    capabilities: [
      "YAML-driven services, bookmarks, widgets, and layout",
      "Server-side proxy boundary for third-party credentials",
      "Broad service-widget adapter ecosystem",
      "Docker socket and label-based service discovery",
      "Search, localization, theming, and custom styling",
      "Static-first Next.js application delivery",
      "Health and status presentation across services",
      "Container images and documented deployment paths",
    ],
    architecture: [
      { label: "Declare", title: "Configuration describes the dashboard", detail: "YAML files define content, grouping, visual layout, providers, and service-specific widget settings.", technologies: ["YAML", "Schemas", "Configuration"] },
      { label: "Discover", title: "Docker metadata can add running services", detail: "Socket and label integrations translate container metadata into dashboard entries without duplicating operational state.", technologies: ["Docker", "Labels", "Discovery"] },
      { label: "Render", title: "Next.js converts configuration into a responsive surface", detail: "Server and client components compose groups, bookmarks, service cards, search, themes, and localized presentation.", technologies: ["Next.js", "React", "Tailwind CSS"] },
      { label: "Proxy", title: "External service calls stay behind the server", detail: "Integration adapters keep tokens away from the browser and normalize service-specific requests and response shapes.", technologies: ["API proxy", "Adapters", "Secrets"] },
      { label: "Observe", title: "Widgets expose service state without coupling", detail: "Each widget owns its endpoint mapping and failure state so a degraded provider does not collapse the full homepage.", technologies: ["Widgets", "Status", "Error isolation"] },
      { label: "Ship", title: "Static assets and containers support simple operations", detail: "A container-first path and documented configuration volumes make the same dashboard portable across home labs and servers.", technologies: ["Docker", "Volumes", "CI"] },
    ],
    engineeringNotes: [
      { title: "Configuration is the interface", detail: "The application remains broadly useful because users extend data instead of forking component code." },
      { title: "Proxying protects integration secrets", detail: "Service credentials remain server-side even though the resulting status is visible in the browser." },
      { title: "Attribution stays explicit", detail: "This item documents an upstream open-source system reviewed locally and does not claim original authorship." },
    ],
    verification: "Public upstream product and nested source repository reviewed on 2026-07-16; no personal authorship claim",
  },
  {
    id: "ecommerce-store",
    slug: "nextjs-commerce-reference",
    title: "Next.js Commerce",
    kicker: "A server-first storefront architecture for headless commerce",
    description:
      "A reviewed open-source storefront reference using the App Router, React Server Components, streaming, tag-based revalidation, Shopify data, cart mutations, and hosted checkout.",
    shortDescription:
      "An open-source headless commerce reference for server rendering, product discovery, cache invalidation, cart state, and Shopify checkout.",
    category: "Open-source Reference",
    role: "Architecture review and local storefront evaluation",
    period: "Open source",
    status: "Live",
    liveUrl: "https://demo.vercel.store/",
    githubUrl: "https://github.com/vercel/commerce",
    image: "/projects/ecommerce-store.png",
    imageAlt: "Next.js Commerce public demo storefront",
    featured: false,
    sortOrder: 11,
    techStack: ["Next.js", "React Server Components", "Server Actions", "Shopify", "GraphQL", "Tailwind CSS", "Vercel"],
    proof: [
      { value: "OSS", label: "upstream project reference" },
      { value: "RSC", label: "server-first rendering model" },
      { value: "1", label: "headless provider boundary" },
    ],
    challenge:
      "A headless storefront must keep product pages fast and cacheable while prices, availability, carts, and checkout remain dynamic. The architecture also needs a clean provider boundary so commerce data does not leak through every UI component.",
    system:
      "App Router server components fetch catalog data through a Shopify adapter, streaming and suspense shape delivery, and cache tags isolate revalidation. Server Actions mutate cart state while checkout transfers to Shopify's hosted boundary.",
    outcome:
      "The reference demonstrates how server-first rendering and explicit commerce adapters can reduce client JavaScript without giving up search, cart, metadata, dynamic OG images, or transactional state. It is not presented as original authorship.",
    capabilities: [
      "Server-rendered catalog, collections, search, and products",
      "Shopify Storefront GraphQL adapter",
      "React Server Components and suspense streaming",
      "Tag-based caching and webhook revalidation",
      "Server Action cart mutations",
      "SEO metadata, sitemap, robots, and dynamic OG images",
      "Hosted Shopify checkout handoff",
      "Vercel deployment and environment integration",
    ],
    architecture: [
      { label: "Request", title: "App Router resolves catalog intent on the server", detail: "Routes and search parameters determine collection, product, search, or cart work before the component tree is rendered.", technologies: ["Next.js", "App Router", "RSC"] },
      { label: "Query", title: "A provider adapter owns commerce access", detail: "Shopify GraphQL queries and fragments translate storefront data into stable application shapes.", technologies: ["Shopify", "GraphQL", "Fragments"] },
      { label: "Render", title: "Server components stream the visual catalog", detail: "Suspense boundaries and server rendering deliver useful HTML while slower commerce fragments resolve independently.", technologies: ["React Server Components", "Suspense", "Streaming"] },
      { label: "Cache", title: "Tags separate stable catalog data from change events", detail: "Fetch caching and revalidation tags make pages fast while Shopify webhooks invalidate the affected product and collection views.", technologies: ["Cache tags", "Webhooks", "Revalidation"] },
      { label: "Mutate", title: "Cart operations stay on the server boundary", detail: "Server Actions create, update, and remove cart lines while cookies retain the active cart identity.", technologies: ["Server Actions", "Cookies", "Cart API"] },
      { label: "Checkout", title: "Payment crosses into the commerce provider", detail: "The application preserves discovery and cart experience, then delegates the transaction to Shopify's hosted checkout.", technologies: ["Shopify Checkout", "Redirect", "Vercel"] },
    ],
    engineeringNotes: [
      { title: "The provider boundary is deliberate", detail: "Commerce-specific queries and response mapping stay in one adapter instead of spreading across UI components." },
      { title: "Caching follows business events", detail: "Products and collections are invalidated by provider events rather than a blanket time-to-live." },
      { title: "Attribution stays explicit", detail: "This item documents an upstream open-source system reviewed locally and does not claim original authorship." },
    ],
    verification: "Public upstream demo and nested source repository reviewed on 2026-07-16; no personal authorship claim",
  },
];

type CatalogProject = {
  id: string;
  title: string;
  description: string;
  liveUrl: string | null;
  liveUrlStatus: string;
  primaryRepository: string | null;
  repositoryCount: number;
  technologies: string[];
  architecture: {
    hasFrontend: boolean;
    hasBackend: boolean;
    hasAI: boolean;
    hasDatabase: boolean;
    hasExternalIntegrations: boolean;
    hasDocker: boolean;
    hasExtensionOrPlugin: boolean;
    isAutomation: boolean;
    packageCount: number;
    entryAction: string;
    coreWorkflow: string;
    outcome: string;
    integrationBoundary: string;
  };
};

const projectCatalog: CatalogProject[] = [
  ...catalog1,
  ...catalog2,
  ...catalog3,
  ...catalog4,
  ...catalog5,
  ...catalog6,
];

export const BRAND_NEUTRAL_PROJECT_IDS = [
  "jorge-castro",
  "jorge-chatbot",
  "jorge-castro-wp-plugin",
  "jorge-site",
  "jorge-gpt",
  "jorge-shopify-plugin",
  "jorge-whitelabel",
] as const;

// Generated entries kept out of the public archive: placeholders and practice repos,
// duplicate copies, and upstream open-source code that is not original work. They stay
// in the CMS unpublished (see the project_archive_curation migration) and can be
// re-published from /admin.
export const ARCHIVE_HIDDEN_PROJECT_IDS = new Set([
  "sample",
  "react-practice",
  "test-mautic",
  "template-boiler-plate",
  "comingsoonsite",
  "prompt-testing",
  "prompts",
  "python",
  "chiari-malformations",
  "cerebralbiz-01",
  "nick-chatbot",
  "sanitary-test",
  "realtime-console",
  "devika",
  "realtime",
  "openai-realtime-api-beta-main",
  "promptfoo",
  "mautic",
  "usama-portfolio",
  "voice-assitant",
  "ydlk-core",
  "new-ytdlcore",
  "whatsapp-backup-downloader",
  "listmonk-apis",
]);

// Titles generated from folder names with typos or ambiguous wording.
const catalogTitleFixes: Record<string, string> = {
  "linkedin-scrapper": "LinkedIn Scraper",
  "chatwebby-without-werbite": "Chatwebby Without Website",
  shipgpt: "ShipGPT Website",
  "new-folder-2": "ShipGPT",
  "openclaw-guru-automatino-project-testing": "SiteAudit",
};

const projectIdentityOverrides: Partial<Record<(typeof BRAND_NEUTRAL_PROJECT_IDS)[number], { title: string; description?: string }>> = {
  "jorge-gpt": {
    title: "Multi-Model LLM Gateway",
  },
  "jorge-shopify-plugin": {
    title: "Shopify AI Commerce Connector",
    description: "A Shopify application that connects ecommerce stores to AI services and automated commerce workflows.",
  },
  "jorge-whitelabel": {
    title: "White-Label AI Platform",
    description: "A white-label AI platform designed for branded client deployments.",
  },
};

function classifyProject(project: CatalogProject) {
  const architecture = project.architecture;
  if (architecture.hasAI && architecture.isAutomation) return "AI Automation";
  if (architecture.hasAI) return "AI / ML System";
  if (architecture.hasExtensionOrPlugin) return "Extension / Plugin";
  if (architecture.isAutomation) return "Automation System";
  if (architecture.hasFrontend && architecture.hasBackend) return "Full-stack Product";
  if (architecture.hasBackend) return "Backend / API";
  if (architecture.hasFrontend) return "Product Experience";
  return "Engineering Utility";
}

function compactDescription(description: string) {
  const normalized = description.replace(/\s+/g, " ").trim();
  if (normalized.length <= 190) return normalized;
  return `${normalized.slice(0, 187).trimEnd()}…`;
}

function githubUrl(repository: string | null) {
  if (!repository) return null;
  if (/^https?:\/\//i.test(repository)) return repository;
  return `https://github.com/${repository.replace(/^\/+|\/+$/g, "")}`;
}

function projectStack(project: CatalogProject) {
  const stack = Array.from(new Set(project.technologies.filter(Boolean)));
  if (stack.length) return stack;

  const inferred = [
    project.architecture.hasFrontend && "Frontend Engineering",
    project.architecture.hasBackend && "Backend Engineering",
    project.architecture.hasAI && "Applied AI",
    project.architecture.hasDatabase && "Data Systems",
    project.architecture.isAutomation && "Automation",
  ].filter((item): item is string => Boolean(item));

  return inferred.length ? inferred : ["Software Architecture"];
}

function architectureTechnologies(stack: string[], offset: number) {
  const selected = [stack[offset % stack.length], stack[(offset + 1) % stack.length]];
  return Array.from(new Set(selected));
}

function generatedCapabilities(project: CatalogProject) {
  const architecture = project.architecture;
  const capabilities = [
    `${architecture.entryAction} intake and validation`,
    `${architecture.coreWorkflow} execution`,
    `${architecture.integrationBoundary} integration boundary`,
    `${architecture.outcome} delivery`,
    architecture.hasAI && "AI-assisted reasoning and model orchestration",
    architecture.hasDatabase && "Persistent data and state management",
    architecture.isAutomation && "Repeatable automation and recovery paths",
    architecture.hasExternalIntegrations && "External service and API coordination",
    architecture.hasDocker && "Containerized delivery workflow",
    architecture.hasExtensionOrPlugin && "Host-platform extension lifecycle",
  ].filter((item): item is string => Boolean(item));

  return Array.from(new Set(capabilities)).slice(0, 8);
}

function createCatalogProject(project: CatalogProject, sortOrder: number): PortfolioProject {
  const category = classifyProject(project);
  const techStack = projectStack(project);
  const isLive = project.liveUrlStatus === "verified-live" && Boolean(project.liveUrl);
  const architecture = project.architecture;
  const identity = projectIdentityOverrides[project.id as (typeof BRAND_NEUTRAL_PROJECT_IDS)[number]];
  const title = identity?.title || catalogTitleFixes[project.id] || project.title;
  const hasRepository = project.repositoryCount > 0 || Boolean(project.primaryRepository);
  const capabilities = generatedCapabilities(project);
  const description = identity?.description || project.description;

  return {
    id: project.id,
    slug: project.id,
    title,
    kicker: `${category} / reviewed system architecture`,
    description,
    shortDescription: compactDescription(description),
    category,
    role: "Product and systems engineering",
    period: isLive ? "Production" : "Source archive",
    status: isLive ? "Live" : "Documented",
    liveUrl: isLive ? project.liveUrl : null,
    githubUrl: githubUrl(project.primaryRepository),
    image: project.id === "wyz-ai" ? "/projects/wyz-ai.png" : "/projects/project-system.svg",
    imageAlt: isLive
      ? `${title} live product interface`
      : `${title} system architecture cover`,
    featured: false,
    published: !ARCHIVE_HIDDEN_PROJECT_IDS.has(project.id),
    sortOrder,
    techStack,
    proof: [
      hasRepository
        ? { value: String(Math.max(project.repositoryCount, 1)), label: "source repositories indexed" }
        : { value: "Local", label: "source folder reviewed, no public repository" },
      architecture.packageCount > 0
        ? { value: String(architecture.packageCount), label: "application packages detected" }
        : { value: String(capabilities.length), label: "capabilities documented" },
      { value: String(techStack.length), label: "core technologies mapped" },
    ],
    challenge: `${description} The engineering challenge is to turn that scope into a legible system with explicit inputs, dependable workflow boundaries, and an outcome that can be inspected and maintained.`,
    system: `The reviewed implementation routes ${architecture.entryAction.toLowerCase()} through ${architecture.coreWorkflow.toLowerCase()}, crosses ${architecture.integrationBoundary.toLowerCase()} where required, and produces ${architecture.outcome.toLowerCase()}.`,
    outcome: isLive
      ? `${title} is represented by a verified public deployment and a reviewed source inventory. The case study keeps the implementation path visible without inventing unsupported performance claims.`
      : `${title} is included as documented engineering work. Its source structure, technology stack, and functional flow are presented here even though no verified public deployment is currently available.`,
    capabilities,
    architecture: [
      {
        label: "Input",
        title: architecture.entryAction,
        detail: "The workflow begins with a defined user, event, document, media, or service input and establishes the state required for processing.",
        technologies: architectureTechnologies(techStack, 0),
      },
      {
        label: "Process",
        title: architecture.coreWorkflow,
        detail: "Domain logic coordinates the central transformation, reasoning, automation, or product workflow behind the project.",
        technologies: architectureTechnologies(techStack, 2),
      },
      {
        label: "Integrate",
        title: architecture.integrationBoundary,
        detail: "External APIs, model providers, storage, platform services, or host applications are kept behind an explicit integration boundary.",
        technologies: architectureTechnologies(techStack, 4),
      },
      {
        label: "Deliver",
        title: architecture.outcome,
        detail: "The system returns an actionable product result, structured dataset, automated operation, or user-facing response.",
        technologies: architectureTechnologies(techStack, 6),
      },
    ],
    engineeringNotes: [
      { title: "The source remains the evidence", detail: "Descriptions and architecture are grounded in the indexed repository structure, package metadata, and reviewed functional flow." },
      { title: "Boundaries stay explicit", detail: "Inputs, core workflow, integrations, and outcomes are separated so the system can be understood without relying on a public demo." },
      { title: "Deployment status is honest", detail: isLive ? "A verified live URL is shown as deployment evidence." : "No live action is displayed because a public deployment could not be verified." },
    ],
    verification: isLive
      ? "Live product and source inventory reviewed on 2026-07-16"
      : "Source tree and architecture inventory reviewed on 2026-07-16; no public deployment verified",
  };
}

const curatedIds = new Set(curatedPortfolioProjects.map((project) => project.id));
const generatedPortfolioProjects = projectCatalog
  .filter((project) => !curatedIds.has(project.id))
  .sort((first, second) => {
    const liveDifference = Number(Boolean(second.liveUrl)) - Number(Boolean(first.liveUrl));
    return liveDifference || first.title.localeCompare(second.title);
  })
  .map((project, index) => createCatalogProject(project, curatedPortfolioProjects.length + index + 1));

export const portfolioProjects: PortfolioProject[] = [
  ...curatedPortfolioProjects.map((project) => ({ ...project, published: true })),
  ...generatedPortfolioProjects,
];

export function getPortfolioProject(slug: string) {
  return portfolioProjects.find((project) => project.slug === slug);
}
