export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Param {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: string;
}

export interface StatusCode {
  status: number;
  description: string;
}

export interface Endpoint {
  method: HttpMethod;
  path: string;
  auth: boolean;
  description: string;
  queryParams?: Param[];
  bodyFields?: Param[];
  bodyExample?: string;
  response: string;
  errors: StatusCode[];
  curlExample: string;
  fetchExample: string;
}

export interface EndpointGroup {
  title: string;
  slug: string;
  description: string;
  endpoints: Endpoint[];
}

const BASE = "https://umar-abdullah.com";

export const apiDocs: EndpointGroup[] = [
  {
    title: "Authentication",
    slug: "authentication",
    description:
      "Endpoints for admin authentication. Login sets an httpOnly cookie; all protected endpoints require it.",
    endpoints: [
      {
        method: "POST",
        path: "/api/auth/login",
        auth: false,
        description:
          "Authenticate with email and password. Sets an httpOnly admin_token cookie valid for 1 hour. Rate-limited to 5 attempts per 15 minutes per IP.",
        bodyFields: [
          { name: "email", type: "string", required: true, description: "Admin email address" },
          { name: "password", type: "string", required: true, description: "Admin password" },
        ],
        bodyExample: `{
  "email": "admin@example.com",
  "password": "your-password"
}`,
        response: `{
  "user": {
    "id": "clx...",
    "email": "admin@example.com",
    "name": "Admin"
  }
}`,
        errors: [
          { status: 400, description: "Email and password required" },
          { status: 401, description: "Invalid credentials" },
          { status: 429, description: "Too many login attempts" },
          { status: 500, description: "Internal server error" },
        ],
        curlExample: `curl -X POST ${BASE}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@example.com","password":"your-password"}'`,
        fetchExample: `const res = await fetch("${BASE}/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@example.com",
    password: "your-password",
  }),
});
const data = await res.json();`,
      },
      {
        method: "POST",
        path: "/api/auth/logout",
        auth: false,
        description: "Clears the admin_token cookie, ending the session.",
        response: `{
  "success": true
}`,
        errors: [],
        curlExample: `curl -X POST ${BASE}/api/auth/logout`,
        fetchExample: `await fetch("${BASE}/api/auth/logout", {
  method: "POST",
  credentials: "include",
});`,
      },
      {
        method: "GET",
        path: "/api/auth/me",
        auth: true,
        description: "Returns the currently authenticated user decoded from the JWT token.",
        response: `{
  "user": {
    "id": "clx...",
    "email": "admin@example.com"
  }
}`,
        errors: [{ status: 401, description: "Authentication required or invalid token" }],
        curlExample: `curl ${BASE}/api/auth/me \\
  -H "Cookie: admin_token=<token>"`,
        fetchExample: `const res = await fetch("${BASE}/api/auth/me", {
  credentials: "include",
});
const data = await res.json();`,
      },
    ],
  },
  {
    title: "Blog Posts",
    slug: "blog-posts",
    description:
      "Public endpoints for reading blog posts and admin endpoints for managing them.",
    endpoints: [
      {
        method: "GET",
        path: "/api/blog",
        auth: false,
        description:
          "List published blog posts with pagination. Optionally filter by tag or category.",
        queryParams: [
          { name: "page", type: "number", default: "1", description: "Page number (min 1)" },
          { name: "limit", type: "number", default: "10", description: "Posts per page (1–50)" },
          { name: "tag", type: "string", description: "Filter posts containing this tag" },
          { name: "category", type: "string", description: "Filter by exact category match" },
        ],
        response: `{
  "posts": [
    {
      "id": "clx...",
      "slug": "my-post",
      "title": "My Post",
      "excerpt": "A short summary...",
      "coverImage": "/images/post.jpg",
      "tags": ["react", "nextjs"],
      "category": "Frontend",
      "readingTime": 5,
      "status": "published",
      "featured": false,
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}`,
        errors: [{ status: 500, description: "Internal server error" }],
        curlExample: `curl "${BASE}/api/blog?page=1&limit=10&tag=react"`,
        fetchExample: `const res = await fetch("${BASE}/api/blog?page=1&limit=10");
const data = await res.json();`,
      },
      {
        method: "GET",
        path: "/api/blog/:slug",
        auth: false,
        description: "Retrieve a single published blog post by its URL slug.",
        response: `{
  "post": {
    "id": "clx...",
    "slug": "my-post",
    "title": "My Post",
    "excerpt": "A short summary...",
    "content": "# Full markdown content...",
    "coverImage": "/images/post.jpg",
    "tags": ["react", "nextjs"],
    "category": "Frontend",
    "readingTime": 5,
    "author": "admin@example.com",
    "status": "published",
    "featured": false,
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-01-16T08:00:00.000Z"
  }
}`,
        errors: [
          { status: 404, description: "Post not found" },
          { status: 500, description: "Internal server error" },
        ],
        curlExample: `curl ${BASE}/api/blog/my-post`,
        fetchExample: `const res = await fetch("${BASE}/api/blog/my-post");
const data = await res.json();`,
      },
      {
        method: "POST",
        path: "/api/blog",
        auth: true,
        description:
          "Create a new blog post. The author field is set from the authenticated user.",
        bodyFields: [
          { name: "slug", type: "string", required: true, description: "URL-friendly slug (unique)" },
          { name: "title", type: "string", required: true, description: "Post title" },
          { name: "excerpt", type: "string", required: true, description: "Short summary" },
          { name: "content", type: "string", required: true, description: "Markdown body" },
          { name: "coverImage", type: "string | null", description: "Cover image path" },
          { name: "tags", type: "string[]", default: "[]", description: "Tag list" },
          { name: "category", type: "string | null", description: "Post category" },
          { name: "readingTime", type: "number", default: "5", description: "Estimated reading time in minutes" },
          { name: "status", type: "string", default: '"published"', description: '"published" or "draft"' },
          { name: "featured", type: "boolean", default: "false", description: "Featured flag" },
        ],
        bodyExample: `{
  "slug": "my-new-post",
  "title": "My New Post",
  "excerpt": "A brief intro...",
  "content": "# Hello World\\n\\nPost content here.",
  "tags": ["nextjs"],
  "category": "Frontend"
}`,
        response: `{
  "post": {
    "id": "clx...",
    "slug": "my-new-post",
    "title": "My New Post",
    "excerpt": "A brief intro...",
    "content": "# Hello World\\n\\nPost content here.",
    "tags": ["nextjs"],
    "category": "Frontend",
    "readingTime": 5,
    "status": "published",
    "featured": false,
    "createdAt": "2026-04-20T12:00:00.000Z"
  }
}`,
        errors: [
          { status: 400, description: "slug, title, excerpt, and content are required" },
          { status: 401, description: "Authentication required" },
          { status: 409, description: "A post with this slug already exists" },
          { status: 500, description: "Internal server error" },
        ],
        curlExample: `curl -X POST ${BASE}/api/blog \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_token=<token>" \\
  -d '{"slug":"my-new-post","title":"My New Post","excerpt":"A brief intro...","content":"# Hello"}'`,
        fetchExample: `const res = await fetch("${BASE}/api/blog", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    slug: "my-new-post",
    title: "My New Post",
    excerpt: "A brief intro...",
    content: "# Hello World",
  }),
});
const data = await res.json();`,
      },
      {
        method: "PUT",
        path: "/api/blog/:slug",
        auth: true,
        description:
          "Update an existing blog post by slug. All fields are optional (partial update).",
        bodyFields: [
          { name: "title", type: "string", description: "Post title" },
          { name: "excerpt", type: "string", description: "Short summary" },
          { name: "content", type: "string", description: "Markdown body" },
          { name: "coverImage", type: "string", description: "Cover image path" },
          { name: "tags", type: "string[]", description: "Tag list" },
          { name: "category", type: "string", description: "Post category" },
          { name: "readingTime", type: "number", description: "Estimated reading time" },
          { name: "status", type: "string", description: '"published" or "draft"' },
          { name: "featured", type: "boolean", description: "Featured flag" },
        ],
        bodyExample: `{
  "title": "Updated Title",
  "tags": ["react", "typescript"]
}`,
        response: `{
  "post": {
    "id": "clx...",
    "slug": "my-post",
    "title": "Updated Title",
    "tags": ["react", "typescript"],
    "updatedAt": "2026-04-20T14:00:00.000Z"
  }
}`,
        errors: [
          { status: 401, description: "Authentication required" },
          { status: 404, description: "Post not found" },
          { status: 500, description: "Internal server error" },
        ],
        curlExample: `curl -X PUT ${BASE}/api/blog/my-post \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_token=<token>" \\
  -d '{"title":"Updated Title"}'`,
        fetchExample: `const res = await fetch("${BASE}/api/blog/my-post", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ title: "Updated Title" }),
});
const data = await res.json();`,
      },
      {
        method: "DELETE",
        path: "/api/blog/:slug",
        auth: true,
        description: "Permanently delete a blog post by slug.",
        response: `{
  "success": true
}`,
        errors: [
          { status: 401, description: "Authentication required" },
          { status: 404, description: "Post not found" },
          { status: 500, description: "Internal server error" },
        ],
        curlExample: `curl -X DELETE ${BASE}/api/blog/my-post \\
  -H "Cookie: admin_token=<token>"`,
        fetchExample: `await fetch("${BASE}/api/blog/my-post", {
  method: "DELETE",
  credentials: "include",
});`,
      },
    ],
  },
  {
    title: "Projects",
    slug: "projects",
    description: "Admin endpoints for managing portfolio projects.",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/projects",
        auth: true,
        description: "List all projects ordered by sort order.",
        response: `{
  "projects": [
    {
      "id": "clx...",
      "title": "My App",
      "description": "A cool project",
      "techStack": ["Next.js", "Prisma"],
      "liveUrl": "https://myapp.com",
      "githubUrl": "https://github.com/user/myapp",
      "image": "/images/myapp.png",
      "featured": true,
      "sortOrder": 1,
      "createdAt": "2026-01-10T10:00:00.000Z"
    }
  ]
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl ${BASE}/api/admin/projects \\
  -H "Cookie: admin_token=<token>"`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/projects", {
  credentials: "include",
});
const data = await res.json();`,
      },
      {
        method: "POST",
        path: "/api/admin/projects",
        auth: true,
        description: "Create a new portfolio project.",
        bodyFields: [
          { name: "title", type: "string", required: true, description: "Project title" },
          { name: "description", type: "string", required: true, description: "Project description" },
          { name: "techStack", type: "string[]", description: "Technology stack list" },
          { name: "liveUrl", type: "string", description: "Live demo URL" },
          { name: "githubUrl", type: "string", description: "GitHub repository URL" },
          { name: "image", type: "string", description: "Project image path" },
          { name: "featured", type: "boolean", default: "false", description: "Featured flag" },
          { name: "sortOrder", type: "number", default: "0", description: "Display order" },
        ],
        bodyExample: `{
  "title": "My App",
  "description": "A cool project",
  "techStack": ["Next.js", "Prisma"],
  "liveUrl": "https://myapp.com",
  "githubUrl": "https://github.com/user/myapp"
}`,
        response: `{
  "project": {
    "id": "clx...",
    "title": "My App",
    "description": "A cool project",
    "techStack": ["Next.js", "Prisma"],
    "createdAt": "2026-04-20T12:00:00.000Z"
  }
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl -X POST ${BASE}/api/admin/projects \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_token=<token>" \\
  -d '{"title":"My App","description":"A cool project","techStack":["Next.js"]}'`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/projects", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    title: "My App",
    description: "A cool project",
    techStack: ["Next.js", "Prisma"],
  }),
});
const data = await res.json();`,
      },
      {
        method: "PUT",
        path: "/api/admin/projects/:id",
        auth: true,
        description: "Update an existing project by ID.",
        bodyFields: [
          { name: "title", type: "string", description: "Project title" },
          { name: "description", type: "string", description: "Project description" },
          { name: "techStack", type: "string[]", description: "Technology stack list" },
          { name: "liveUrl", type: "string", description: "Live demo URL" },
          { name: "githubUrl", type: "string", description: "GitHub repository URL" },
          { name: "image", type: "string", description: "Project image path" },
          { name: "featured", type: "boolean", description: "Featured flag" },
          { name: "sortOrder", type: "number", description: "Display order" },
        ],
        bodyExample: `{
  "title": "Updated App Name",
  "featured": true
}`,
        response: `{
  "project": {
    "id": "clx...",
    "title": "Updated App Name",
    "featured": true,
    "updatedAt": "2026-04-20T14:00:00.000Z"
  }
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl -X PUT ${BASE}/api/admin/projects/<id> \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_token=<token>" \\
  -d '{"title":"Updated App Name"}'`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/projects/<id>", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ title: "Updated App Name" }),
});
const data = await res.json();`,
      },
      {
        method: "DELETE",
        path: "/api/admin/projects/:id",
        auth: true,
        description: "Delete a project by ID.",
        response: `{
  "success": true
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl -X DELETE ${BASE}/api/admin/projects/<id> \\
  -H "Cookie: admin_token=<token>"`,
        fetchExample: `await fetch("${BASE}/api/admin/projects/<id>", {
  method: "DELETE",
  credentials: "include",
});`,
      },
    ],
  },
  {
    title: "Experiences",
    slug: "experiences",
    description: "Admin endpoints for managing work experience entries.",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/experiences",
        auth: true,
        description: "List all experiences ordered by sort order.",
        response: `{
  "experiences": [
    {
      "id": "clx...",
      "company": "Acme Corp",
      "role": "Senior Engineer",
      "period": "2024 - Present",
      "description": "Led the platform team...",
      "location": "Remote",
      "type": "Full-time",
      "current": true,
      "sortOrder": 1
    }
  ]
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl ${BASE}/api/admin/experiences \\
  -H "Cookie: admin_token=<token>"`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/experiences", {
  credentials: "include",
});
const data = await res.json();`,
      },
      {
        method: "POST",
        path: "/api/admin/experiences",
        auth: true,
        description: "Create a new experience entry.",
        bodyFields: [
          { name: "company", type: "string", required: true, description: "Company name" },
          { name: "role", type: "string", required: true, description: "Job title" },
          { name: "period", type: "string", required: true, description: 'Time period (e.g. "2024 - Present")' },
          { name: "description", type: "string", required: true, description: "Role description" },
          { name: "location", type: "string", description: "Work location" },
          { name: "type", type: "string", description: '"Full-time", "Part-time", "Contract"' },
          { name: "current", type: "boolean", default: "false", description: "Is this the current role" },
          { name: "sortOrder", type: "number", default: "0", description: "Display order" },
        ],
        bodyExample: `{
  "company": "Acme Corp",
  "role": "Senior Engineer",
  "period": "2024 - Present",
  "description": "Led the platform team...",
  "location": "Remote",
  "type": "Full-time",
  "current": true
}`,
        response: `{
  "experience": {
    "id": "clx...",
    "company": "Acme Corp",
    "role": "Senior Engineer",
    "createdAt": "2026-04-20T12:00:00.000Z"
  }
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl -X POST ${BASE}/api/admin/experiences \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_token=<token>" \\
  -d '{"company":"Acme Corp","role":"Senior Engineer","period":"2024 - Present","description":"Led the platform team..."}'`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/experiences", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    company: "Acme Corp",
    role: "Senior Engineer",
    period: "2024 - Present",
    description: "Led the platform team...",
  }),
});
const data = await res.json();`,
      },
      {
        method: "PUT",
        path: "/api/admin/experiences/:id",
        auth: true,
        description: "Update an existing experience by ID.",
        bodyFields: [
          { name: "company", type: "string", description: "Company name" },
          { name: "role", type: "string", description: "Job title" },
          { name: "period", type: "string", description: "Time period" },
          { name: "description", type: "string", description: "Role description" },
          { name: "location", type: "string", description: "Work location" },
          { name: "type", type: "string", description: "Employment type" },
          { name: "current", type: "boolean", description: "Is current role" },
          { name: "sortOrder", type: "number", description: "Display order" },
        ],
        bodyExample: `{
  "role": "Staff Engineer",
  "current": true
}`,
        response: `{
  "experience": {
    "id": "clx...",
    "role": "Staff Engineer",
    "current": true,
    "updatedAt": "2026-04-20T14:00:00.000Z"
  }
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl -X PUT ${BASE}/api/admin/experiences/<id> \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_token=<token>" \\
  -d '{"role":"Staff Engineer"}'`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/experiences/<id>", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ role: "Staff Engineer" }),
});
const data = await res.json();`,
      },
      {
        method: "DELETE",
        path: "/api/admin/experiences/:id",
        auth: true,
        description: "Delete an experience by ID.",
        response: `{
  "success": true
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl -X DELETE ${BASE}/api/admin/experiences/<id> \\
  -H "Cookie: admin_token=<token>"`,
        fetchExample: `await fetch("${BASE}/api/admin/experiences/<id>", {
  method: "DELETE",
  credentials: "include",
});`,
      },
    ],
  },
  {
    title: "Skills",
    slug: "skills",
    description: "Admin endpoints for managing skill entries.",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/skills",
        auth: true,
        description: "List all skills ordered by sort order.",
        response: `{
  "skills": [
    {
      "id": "clx...",
      "name": "TypeScript",
      "category": "Languages",
      "proficiency": 95,
      "sortOrder": 1
    }
  ]
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl ${BASE}/api/admin/skills \\
  -H "Cookie: admin_token=<token>"`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/skills", {
  credentials: "include",
});
const data = await res.json();`,
      },
      {
        method: "POST",
        path: "/api/admin/skills",
        auth: true,
        description: "Create a new skill.",
        bodyFields: [
          { name: "name", type: "string", required: true, description: "Skill name" },
          { name: "category", type: "string", required: true, description: "Skill category" },
          { name: "proficiency", type: "number", required: true, description: "Proficiency level (0–100)" },
          { name: "sortOrder", type: "number", default: "0", description: "Display order" },
        ],
        bodyExample: `{
  "name": "TypeScript",
  "category": "Languages",
  "proficiency": 95
}`,
        response: `{
  "skill": {
    "id": "clx...",
    "name": "TypeScript",
    "category": "Languages",
    "proficiency": 95,
    "sortOrder": 0
  }
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl -X POST ${BASE}/api/admin/skills \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_token=<token>" \\
  -d '{"name":"TypeScript","category":"Languages","proficiency":95}'`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/skills", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    name: "TypeScript",
    category: "Languages",
    proficiency: 95,
  }),
});
const data = await res.json();`,
      },
      {
        method: "PUT",
        path: "/api/admin/skills/:id",
        auth: true,
        description: "Update an existing skill by ID.",
        bodyFields: [
          { name: "name", type: "string", description: "Skill name" },
          { name: "category", type: "string", description: "Skill category" },
          { name: "proficiency", type: "number", description: "Proficiency level (0–100)" },
          { name: "sortOrder", type: "number", description: "Display order" },
        ],
        bodyExample: `{
  "proficiency": 98
}`,
        response: `{
  "skill": {
    "id": "clx...",
    "name": "TypeScript",
    "proficiency": 98,
    "updatedAt": "2026-04-20T14:00:00.000Z"
  }
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl -X PUT ${BASE}/api/admin/skills/<id> \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_token=<token>" \\
  -d '{"proficiency":98}'`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/skills/<id>", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ proficiency: 98 }),
});
const data = await res.json();`,
      },
      {
        method: "DELETE",
        path: "/api/admin/skills/:id",
        auth: true,
        description: "Delete a skill by ID.",
        response: `{
  "success": true
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl -X DELETE ${BASE}/api/admin/skills/<id> \\
  -H "Cookie: admin_token=<token>"`,
        fetchExample: `await fetch("${BASE}/api/admin/skills/<id>", {
  method: "DELETE",
  credentials: "include",
});`,
      },
    ],
  },
  {
    title: "Other",
    slug: "other",
    description:
      "Health check, contact form, admin contacts, site settings, and dashboard stats.",
    endpoints: [
      {
        method: "GET",
        path: "/api/health",
        auth: false,
        description: "Health check endpoint. Pings the database and returns status.",
        response: `{
  "status": "ok",
  "db": "ok"
}`,
        errors: [{ status: 503, description: "Database unreachable" }],
        curlExample: `curl ${BASE}/api/health`,
        fetchExample: `const res = await fetch("${BASE}/api/health");
const data = await res.json();`,
      },
      {
        method: "POST",
        path: "/api/contact",
        auth: false,
        description:
          "Submit a contact form message. Inputs are sanitized. Rate-limited to 5 submissions per 15 minutes per IP.",
        bodyFields: [
          { name: "name", type: "string", required: true, description: "Sender name (max 200 chars)" },
          { name: "email", type: "string", required: true, description: "Sender email (max 254 chars)" },
          { name: "subject", type: "string", description: "Message subject (max 500 chars)" },
          { name: "message", type: "string", required: true, description: "Message body (max 5000 chars)" },
        ],
        bodyExample: `{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Hello",
  "message": "I'd like to discuss a project."
}`,
        response: `{
  "success": true,
  "id": "clx..."
}`,
        errors: [
          { status: 400, description: "Validation error (missing fields, invalid email, length exceeded)" },
          { status: 429, description: "Too many submissions" },
          { status: 500, description: "Internal server error" },
        ],
        curlExample: `curl -X POST ${BASE}/api/contact \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Jane Doe","email":"jane@example.com","message":"Hello!"}'`,
        fetchExample: `const res = await fetch("${BASE}/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Jane Doe",
    email: "jane@example.com",
    message: "Hello!",
  }),
});
const data = await res.json();`,
      },
      {
        method: "GET",
        path: "/api/admin/contacts",
        auth: true,
        description: "List all contact form submissions, newest first.",
        response: `{
  "contacts": [
    {
      "id": "clx...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "subject": "Hello",
      "message": "I'd like to discuss a project.",
      "read": false,
      "createdAt": "2026-04-20T12:00:00.000Z"
    }
  ]
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl ${BASE}/api/admin/contacts \\
  -H "Cookie: admin_token=<token>"`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/contacts", {
  credentials: "include",
});
const data = await res.json();`,
      },
      {
        method: "PATCH",
        path: "/api/admin/contacts",
        auth: true,
        description: "Mark a contact submission as read or unread.",
        bodyFields: [
          { name: "id", type: "string", required: true, description: "Contact submission ID" },
          { name: "read", type: "boolean", required: true, description: "Read status" },
        ],
        bodyExample: `{
  "id": "clx...",
  "read": true
}`,
        response: `{
  "contact": {
    "id": "clx...",
    "read": true
  }
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl -X PATCH ${BASE}/api/admin/contacts \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_token=<token>" \\
  -d '{"id":"clx...","read":true}'`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/contacts", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ id: "clx...", read: true }),
});
const data = await res.json();`,
      },
      {
        method: "GET",
        path: "/api/admin/settings",
        auth: true,
        description: "Retrieve all site settings as key-value pairs.",
        response: `{
  "settings": [
    { "key": "site_title", "value": "Umar Abdullah" },
    { "key": "social_github", "value": "https://github.com/..." }
  ]
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl ${BASE}/api/admin/settings \\
  -H "Cookie: admin_token=<token>"`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/settings", {
  credentials: "include",
});
const data = await res.json();`,
      },
      {
        method: "PUT",
        path: "/api/admin/settings",
        auth: true,
        description: "Bulk upsert site settings. Each key is created or updated.",
        bodyFields: [
          {
            name: "settings",
            type: "{ key: string; value: string }[]",
            required: true,
            description: "Array of key-value pairs to upsert",
          },
        ],
        bodyExample: `{
  "settings": [
    { "key": "site_title", "value": "New Title" },
    { "key": "social_github", "value": "https://github.com/new" }
  ]
}`,
        response: `{
  "success": true
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl -X PUT ${BASE}/api/admin/settings \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_token=<token>" \\
  -d '{"settings":[{"key":"site_title","value":"New Title"}]}'`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/settings", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
    settings: [{ key: "site_title", value: "New Title" }],
  }),
});
const data = await res.json();`,
      },
      {
        method: "GET",
        path: "/api/admin/stats",
        auth: true,
        description:
          "Returns aggregate counts for the admin dashboard: posts, projects, experiences, skills, contacts, and unread contacts.",
        response: `{
  "posts": 12,
  "projects": 6,
  "experiences": 4,
  "skills": 15,
  "contacts": 23,
  "unreadContacts": 3
}`,
        errors: [{ status: 401, description: "Authentication required" }],
        curlExample: `curl ${BASE}/api/admin/stats \\
  -H "Cookie: admin_token=<token>"`,
        fetchExample: `const res = await fetch("${BASE}/api/admin/stats", {
  credentials: "include",
});
const data = await res.json();`,
      },
    ],
  },
];
