# Portfolio API Documentation

**Base URL:** `https://umar-abdullah.com`

## Authentication

All admin/write endpoints require a valid `admin_token` cookie. Get one by logging in first.

Rate limit on login: **5 attempts per 15-minute window** per IP.

### POST `/api/auth/login`
Login and receive an auth cookie.

**Body:**
```json
{
  "email": "admin@umar-abdullah.com",
  "password": "your-password"
}
```

**Response (200):**
```json
{
  "user": { "id": "...", "email": "admin@umar-abdullah.com", "name": "Umar Abdullah" }
}
```
Sets `admin_token` cookie (httpOnly, secure, 1 hour expiry).

**Errors:** `400` missing fields, `401` invalid credentials, `429` rate limited.

---

### POST `/api/auth/logout`
Clears the auth cookie.

**Response (200):** `{ "success": true }`

---

### GET `/api/auth/me`
Get current authenticated user. Requires `admin_token` cookie.

**Response (200):**
```json
{ "user": { "id": "...", "email": "...", "name": "..." } }
```

---

## Blog Posts

### GET `/api/blog` (Public)
List published blog posts with pagination.

**Query params:**
| Param      | Type   | Default | Description                    |
|------------|--------|---------|--------------------------------|
| `page`     | number | 1       | Page number                    |
| `limit`    | number | 10      | Posts per page (max 50)        |
| `tag`      | string | —       | Filter by tag                  |
| `category` | string | —       | Filter by category             |

**Response (200):**
```json
{
  "posts": [ ... ],
  "pagination": { "page": 1, "limit": 10, "total": 42 }
}
```

---

### GET `/api/blog/:slug` (Public)
Get a single blog post by slug.

**Response (200):**
```json
{
  "post": {
    "id": "cuid",
    "slug": "my-post",
    "title": "My Post",
    "excerpt": "Short summary",
    "content": "Full markdown content",
    "coverImage": "https://...",
    "tags": ["typescript", "nextjs"],
    "category": "tech",
    "author": "Umar Abdullah",
    "publishedAt": "2026-04-20T00:00:00.000Z",
    "featured": false,
    "readingTime": 5,
    "status": "published",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:** `404` post not found.

---

### POST `/api/blog` 🔒
Create a new blog post. Requires auth.

**Body:**
```json
{
  "slug": "my-new-post",          // required, unique
  "title": "My New Post",          // required
  "excerpt": "A short summary",    // required
  "content": "Full content here",  // required
  "coverImage": "https://...",     // optional
  "tags": ["tag1", "tag2"],        // optional, default []
  "category": "tech",              // optional
  "readingTime": 5,                // optional, default 5
  "status": "published",           // optional, default "published"
  "featured": false                // optional, default false
}
```

**Response (201):** `{ "post": { ... } }`

**Errors:** `400` missing required fields, `401` unauthorized, `409` slug already exists.

---

### PUT `/api/blog/:slug` 🔒
Update a blog post. Requires auth. All fields optional (partial update).

**Body:** Any subset of the POST fields (except `slug`).

**Response (200):** `{ "post": { ... } }`

**Errors:** `401` unauthorized, `404` post not found.

---

### DELETE `/api/blog/:slug` 🔒
Delete a blog post. Requires auth.

**Response (200):** `{ "success": true }`

**Errors:** `401` unauthorized, `404` post not found.

---

## Projects

### GET `/api/admin/projects` 🔒
List all projects, ordered by `sortOrder`. Requires auth.

**Response (200):**
```json
{
  "projects": [
    {
      "id": "cuid",
      "title": "Project Name",
      "description": "What it does",
      "techStack": ["Next.js", "TypeScript"],
      "liveUrl": "https://...",
      "githubUrl": "https://github.com/...",
      "image": "https://...",
      "featured": true,
      "sortOrder": 0,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### POST `/api/admin/projects` 🔒
Create a new project. Requires auth.

**Body:**
```json
{
  "title": "My Project",           // required
  "description": "Description",    // required
  "techStack": ["React", "Node"],  // required
  "liveUrl": "https://...",        // optional
  "githubUrl": "https://...",      // optional
  "image": "https://...",          // optional
  "featured": false,               // optional, default false
  "sortOrder": 0                   // optional, default 0
}
```

**Response (201):** `{ "project": { ... } }`

**Errors:** `401` unauthorized.

---

### PUT `/api/admin/projects/:id` 🔒
Update a project by ID. Requires auth.

**Body:** Any subset of the POST fields.

**Response (200):** `{ "project": { ... } }`

**Errors:** `401` unauthorized.

---

### DELETE `/api/admin/projects/:id` 🔒
Delete a project by ID. Requires auth.

**Response (200):** `{ "success": true }`

**Errors:** `401` unauthorized.

---

## Experiences

### GET `/api/admin/experiences` 🔒
List all work experiences, ordered by `sortOrder` ascending. Requires auth.

**Response (200):**
```json
{
  "experiences": [
    {
      "id": "cuid",
      "company": "Acme Corp",
      "role": "Senior Engineer",
      "period": "2023 - Present",
      "description": "Led backend architecture...",
      "location": "Remote",
      "type": "full-time",
      "current": true,
      "sortOrder": 0,
      "createdAt": "2026-04-20T00:00:00.000Z",
      "updatedAt": "2026-04-20T00:00:00.000Z"
    }
  ]
}
```

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -b "admin_token=YOUR_TOKEN" https://umar-abdullah.com/api/admin/experiences
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/experiences", {
  credentials: "include",
});
const data = await res.json();
```
</details>

---

### POST `/api/admin/experiences` 🔒
Create a new work experience. Requires auth.

**Body:**
```json
{
  "company": "Acme Corp",        // required, string
  "role": "Senior Engineer",     // required, string
  "period": "2023 - Present",   // required, string
  "description": "Led backend...", // required, string
  "location": "Remote",          // optional, string
  "type": "full-time",           // optional, string
  "current": true,               // optional, default false
  "sortOrder": 0                 // optional, default 0
}
```

**Response (201):** `{ "experience": { ... } }`

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -X POST -b "admin_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"company":"Acme Corp","role":"Senior Engineer","period":"2023 - Present","description":"Led backend architecture"}' \
  https://umar-abdullah.com/api/admin/experiences
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/experiences", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    company: "Acme Corp",
    role: "Senior Engineer",
    period: "2023 - Present",
    description: "Led backend architecture",
  }),
});
const data = await res.json();
```
</details>

---

### PUT `/api/admin/experiences/:id` 🔒
Update a work experience by ID. Requires auth. All fields optional (partial update).

**Body:** Any subset of the POST fields.

**Response (200):** `{ "experience": { ... } }`

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -X PUT -b "admin_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"current":false,"period":"2021 - 2023"}' \
  https://umar-abdullah.com/api/admin/experiences/EXPERIENCE_ID
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/experiences/EXPERIENCE_ID", {
  method: "PUT",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ current: false, period: "2021 - 2023" }),
});
const data = await res.json();
```
</details>

---

### DELETE `/api/admin/experiences/:id` 🔒
Delete a work experience by ID. Requires auth.

**Response (200):** `{ "success": true }`

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -X DELETE -b "admin_token=YOUR_TOKEN" \
  https://umar-abdullah.com/api/admin/experiences/EXPERIENCE_ID
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/experiences/EXPERIENCE_ID", {
  method: "DELETE",
  credentials: "include",
});
const data = await res.json();
```
</details>

---

## Skills

### GET `/api/admin/skills` 🔒
List all skills, ordered by `sortOrder` ascending. Requires auth.

**Response (200):**
```json
{
  "skills": [
    {
      "id": "cuid",
      "name": "TypeScript",
      "category": "Language",
      "proficiency": 90,
      "sortOrder": 0,
      "createdAt": "2026-04-20T00:00:00.000Z",
      "updatedAt": "2026-04-20T00:00:00.000Z"
    }
  ]
}
```

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -b "admin_token=YOUR_TOKEN" https://umar-abdullah.com/api/admin/skills
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/skills", {
  credentials: "include",
});
const data = await res.json();
```
</details>

---

### POST `/api/admin/skills` 🔒
Create a new skill. Requires auth.

**Body:**
```json
{
  "name": "TypeScript",      // required, string
  "category": "Language",    // required, string
  "proficiency": 90,         // optional, integer, default 80
  "sortOrder": 0             // optional, integer, default 0
}
```

**Response (201):** `{ "skill": { ... } }`

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -X POST -b "admin_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"TypeScript","category":"Language","proficiency":90}' \
  https://umar-abdullah.com/api/admin/skills
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/skills", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "TypeScript", category: "Language", proficiency: 90 }),
});
const data = await res.json();
```
</details>

---

### PUT `/api/admin/skills/:id` 🔒
Update a skill by ID. Requires auth. All fields optional (partial update).

**Body:** Any subset of the POST fields.

**Response (200):** `{ "skill": { ... } }`

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -X PUT -b "admin_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"proficiency":95}' \
  https://umar-abdullah.com/api/admin/skills/SKILL_ID
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/skills/SKILL_ID", {
  method: "PUT",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ proficiency: 95 }),
});
const data = await res.json();
```
</details>

---

### DELETE `/api/admin/skills/:id` 🔒
Delete a skill by ID. Requires auth.

**Response (200):** `{ "success": true }`

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -X DELETE -b "admin_token=YOUR_TOKEN" \
  https://umar-abdullah.com/api/admin/skills/SKILL_ID
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/skills/SKILL_ID", {
  method: "DELETE",
  credentials: "include",
});
const data = await res.json();
```
</details>

---

## Settings

### GET `/api/admin/settings` 🔒
List all site settings. Requires auth.

**Response (200):**
```json
{
  "settings": [
    {
      "id": "cuid",
      "key": "siteTitle",
      "value": "Umar Abdullah Portfolio",
      "createdAt": "2026-04-20T00:00:00.000Z",
      "updatedAt": "2026-04-20T00:00:00.000Z"
    }
  ]
}
```

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -b "admin_token=YOUR_TOKEN" https://umar-abdullah.com/api/admin/settings
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/settings", {
  credentials: "include",
});
const data = await res.json();
```
</details>

---

### PUT `/api/admin/settings` 🔒
Upsert site settings. Accepts an array of `{ key, value }` pairs. Each key is created if it doesn't exist, or updated if it does. Requires auth.

**Body:**
```json
{
  "settings": [
    { "key": "siteTitle", "value": "My Portfolio" },
    { "key": "siteDescription", "value": "A developer portfolio" }
  ]
}
```

**Response (200):** `{ "success": true }`

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -X PUT -b "admin_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"settings":[{"key":"siteTitle","value":"My Portfolio"}]}' \
  https://umar-abdullah.com/api/admin/settings
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/settings", {
  method: "PUT",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    settings: [{ key: "siteTitle", value: "My Portfolio" }],
  }),
});
const data = await res.json();
```
</details>

---

## Contacts

### GET `/api/admin/contacts` 🔒
List all contact form submissions, ordered by `createdAt` descending (newest first). Requires auth.

**Response (200):**
```json
{
  "contacts": [
    {
      "id": "cuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "subject": "Job Inquiry",
      "message": "Hi, I'd like to discuss...",
      "read": false,
      "createdAt": "2026-04-20T00:00:00.000Z"
    }
  ]
}
```

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -b "admin_token=YOUR_TOKEN" https://umar-abdullah.com/api/admin/contacts
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/contacts", {
  credentials: "include",
});
const data = await res.json();
```
</details>

---

### PATCH `/api/admin/contacts` 🔒
Mark a contact submission as read or unread. Requires auth.

**Body:**
```json
{
  "id": "contact-submission-id",  // required, string
  "read": true                     // required, boolean
}
```

**Response (200):** `{ "contact": { ... } }`

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -X PATCH -b "admin_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"CONTACT_ID","read":true}' \
  https://umar-abdullah.com/api/admin/contacts
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/contacts", {
  method: "PATCH",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: "CONTACT_ID", read: true }),
});
const data = await res.json();
```
</details>

---

## Stats

### GET `/api/admin/stats` 🔒
Get dashboard statistics. Returns counts for all major entities. Requires auth.

**Response (200):**
```json
{
  "posts": 12,
  "projects": 5,
  "experiences": 4,
  "skills": 15,
  "contacts": 8,
  "unreadContacts": 3
}
```

**Errors:** `401` unauthorized.

<details>
<summary>curl / fetch examples</summary>

```bash
curl -b "admin_token=YOUR_TOKEN" https://umar-abdullah.com/api/admin/stats
```

```js
const res = await fetch("https://umar-abdullah.com/api/admin/stats", {
  credentials: "include",
});
const data = await res.json();
```
</details>

---

## Contact Form

### POST `/api/contact` (Public)
Submit a contact form message. No authentication required. Rate-limited to **5 submissions per 15-minute window** per IP.

**Body:**
```json
{
  "name": "Jane Doe",             // required, string, max 200 chars
  "email": "jane@example.com",    // required, valid email, max 254 chars
  "subject": "Job Inquiry",       // optional, string, max 500 chars
  "message": "Hello, I wanted..." // required, string, max 5000 chars
}
```

**Response (201):**
```json
{ "success": true, "id": "cuid" }
```

**Errors:**
| Status | Condition |
|--------|-----------|
| `400` | Missing required fields (`name`, `email`, or `message`) |
| `400` | `name` is not a string or exceeds 200 characters |
| `400` | `email` is invalid or exceeds 254 characters |
| `400` | `subject` is not a string or exceeds 500 characters |
| `400` | `message` is not a string or exceeds 5000 characters |
| `429` | Rate limit exceeded (includes `Retry-After` header) |
| `500` | Internal server error |

<details>
<summary>curl / fetch examples</summary>

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","message":"Hello!"}' \
  https://umar-abdullah.com/api/contact
```

```js
const res = await fetch("https://umar-abdullah.com/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Jane Doe",
    email: "jane@example.com",
    message: "Hello!",
  }),
});
const data = await res.json();
```
</details>

---

## Health

### GET `/api/health` (Public)
Health check endpoint. Tests database connectivity.

**Response (200):**
```json
{ "status": "ok", "db": "ok" }
```

**Response (503):**
```json
{ "status": "error", "db": "unreachable" }
```

<details>
<summary>curl / fetch examples</summary>

```bash
curl https://umar-abdullah.com/api/health
```

```js
const res = await fetch("https://umar-abdullah.com/api/health");
const data = await res.json();
```
</details>

---

## Endpoint Coverage

| Endpoint | Method | Auth | Documented |
|----------|--------|------|------------|
| `/api/auth/login` | POST | No | ✅ |
| `/api/auth/logout` | POST | No | ✅ |
| `/api/auth/me` | GET | 🔒 | ✅ |
| `/api/blog` | GET | No | ✅ |
| `/api/blog/:slug` | GET | No | ✅ |
| `/api/blog` | POST | 🔒 | ✅ |
| `/api/blog/:slug` | PUT | 🔒 | ✅ |
| `/api/blog/:slug` | DELETE | 🔒 | ✅ |
| `/api/admin/projects` | GET | 🔒 | ✅ |
| `/api/admin/projects` | POST | 🔒 | ✅ |
| `/api/admin/projects/:id` | PUT | 🔒 | ✅ |
| `/api/admin/projects/:id` | DELETE | 🔒 | ✅ |
| `/api/admin/experiences` | GET | 🔒 | ✅ |
| `/api/admin/experiences` | POST | 🔒 | ✅ |
| `/api/admin/experiences/:id` | PUT | 🔒 | ✅ |
| `/api/admin/experiences/:id` | DELETE | 🔒 | ✅ |
| `/api/admin/skills` | GET | 🔒 | ✅ |
| `/api/admin/skills` | POST | 🔒 | ✅ |
| `/api/admin/skills/:id` | PUT | 🔒 | ✅ |
| `/api/admin/skills/:id` | DELETE | 🔒 | ✅ |
| `/api/admin/settings` | GET | 🔒 | ✅ |
| `/api/admin/settings` | PUT | 🔒 | ✅ |
| `/api/admin/contacts` | GET | 🔒 | ✅ |
| `/api/admin/contacts` | PATCH | 🔒 | ✅ |
| `/api/admin/stats` | GET | 🔒 | ✅ |
| `/api/contact` | POST | No | ✅ |
| `/api/health` | GET | No | ✅ |

## Auth Notes

- 🔒 = requires `admin_token` cookie (get it from `/api/auth/login`)
- Token expires after **1 hour**
- All responses are JSON
- All write endpoints return the created/updated resource
- All admin endpoints return `401` if the `admin_token` cookie is missing or invalid
- Rate limits: login and contact form are limited to 5 attempts per 15 minutes per IP
