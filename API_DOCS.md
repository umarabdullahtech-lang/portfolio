# Portfolio API Documentation

Complete reference for all API endpoints. Base URL: `/api`

## Table of Contents

- [Authentication](#authentication)
- [Public Endpoints](#public-endpoints)
  - [Health Check](#get-apihealth)
  - [Contact Form](#post-apicontact)
  - [Blog Posts (List)](#get-apiblog)
  - [Blog Post (By Slug)](#get-apiblogslug)
- [Auth Endpoints](#auth-endpoints)
  - [Login](#post-apiauthlogin)
  - [Current User](#get-apiauthme)
  - [Logout](#post-apiauthlogout)
- [Admin Endpoints](#admin-endpoints)
  - [Projects](#admin-projects)
  - [Experiences](#admin-experiences)
  - [Skills](#admin-skills)
  - [Contacts](#admin-contacts)
  - [Stats](#get-apiadminstats)
  - [Settings](#admin-settings)
  - [Blog (Create)](#post-apiblog)
  - [Blog (Update)](#put-apiblogslug)
  - [Blog (Delete)](#delete-apiblogslug)

---

## Authentication

Protected endpoints require a JWT token delivered via one of:

- **Cookie:** `admin_token` (set automatically on login; httpOnly, secure, sameSite: strict)
- **Header:** `Authorization: Bearer <token>`

Token lifetime: **1 hour**.

### Error Response Shape

All endpoints return errors in this format:

```json
{
  "error": "Human-readable error message"
}
```

---

## Public Endpoints

### `GET /api/health`

Health check for the application and database.

**Auth required:** No

**Request body:** None

**Response `200`:**

```json
{
  "status": "ok",
  "db": "ok"
}
```

**Response `503`:**

```json
{
  "status": "error",
  "db": "unreachable"
}
```

---

### `POST /api/contact`

Submit a contact form message. Rate-limited to 5 submissions per 15 minutes per IP.

**Auth required:** No

**Request body:**

```json
{
  "name": "string (required, max 200 chars)",
  "email": "string (required, valid email, max 254 chars)",
  "subject": "string (optional, max 500 chars)",
  "message": "string (required, max 5000 chars)"
}
```

**Response `201`:**

```json
{
  "success": true,
  "id": "cuid"
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 400 | Validation error (missing/invalid fields) |
| 429 | Rate limit exceeded. Includes `Retry-After` header (seconds) |
| 500 | Internal server error |

---

### `GET /api/blog`

List published blog posts with pagination and optional filtering.

**Auth required:** No

**Query parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number (min 1) |
| `limit` | number | 10 | Items per page (min 1, max 50) |
| `tag` | string | — | Filter by tag (exact match within tags array) |
| `category` | string | — | Filter by category (exact match) |

**Response `200`:**

```json
{
  "posts": [
    {
      "id": "cuid",
      "slug": "my-post",
      "title": "My Post",
      "excerpt": "Short summary",
      "content": "Full markdown content",
      "coverImage": "https://example.com/img.jpg",
      "tags": ["typescript", "react"],
      "category": "tutorials",
      "author": "Umar Abdullah",
      "publishedAt": "2026-01-15T00:00:00.000Z",
      "featured": false,
      "readingTime": 5,
      "status": "published",
      "createdAt": "2026-01-15T00:00:00.000Z",
      "updatedAt": "2026-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 500 | Internal server error |

---

### `GET /api/blog/:slug`

Get a single blog post by its slug.

**Auth required:** No

**URL parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `slug` | string | The post's unique slug |

**Response `200`:**

```json
{
  "post": {
    "id": "cuid",
    "slug": "my-post",
    "title": "My Post",
    "excerpt": "Short summary",
    "content": "Full markdown content",
    "coverImage": "https://example.com/img.jpg",
    "tags": ["typescript", "react"],
    "category": "tutorials",
    "author": "Umar Abdullah",
    "publishedAt": "2026-01-15T00:00:00.000Z",
    "featured": false,
    "readingTime": 5,
    "status": "published",
    "createdAt": "2026-01-15T00:00:00.000Z",
    "updatedAt": "2026-01-15T00:00:00.000Z"
  }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 404 | Post not found |
| 500 | Internal server error |

---

## Auth Endpoints

### `POST /api/auth/login`

Authenticate as an admin user. Rate-limited to 5 attempts per 15 minutes per IP.

**Auth required:** No

**Request body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response `200`:**

Sets `admin_token` cookie (httpOnly, secure, sameSite: strict, maxAge: 3600).

```json
{
  "user": {
    "id": "cuid",
    "email": "admin@example.com",
    "name": "Admin"
  }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 400 | Email and password required |
| 401 | Invalid credentials |
| 429 | Rate limit exceeded. Includes `Retry-After` header (seconds) |
| 500 | Internal server error |

---

### `GET /api/auth/me`

Get the currently authenticated user.

**Auth required:** Yes

**Request body:** None

**Response `200`:**

```json
{
  "user": {
    "id": "cuid",
    "email": "admin@example.com"
  }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized (missing or invalid token) |
| 500 | Internal server error |

---

### `POST /api/auth/logout`

Clear the authentication cookie and log out.

**Auth required:** No

**Request body:** None

**Response `200`:**

Clears `admin_token` cookie (maxAge: 0).

```json
{
  "success": true
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 500 | Internal server error |

---

## Admin Endpoints

All admin endpoints require authentication via JWT token (cookie or `Authorization` header). Unauthenticated requests return `401`.

---

### Admin: Projects

#### `GET /api/admin/projects`

List all projects, ordered by `sortOrder` ascending.

**Response `200`:**

```json
{
  "projects": [
    {
      "id": "cuid",
      "title": "Portfolio Website",
      "description": "A personal portfolio built with Next.js",
      "techStack": ["Next.js", "TypeScript", "Prisma"],
      "liveUrl": "https://example.com",
      "githubUrl": "https://github.com/user/repo",
      "image": "https://example.com/project.jpg",
      "featured": true,
      "sortOrder": 0,
      "createdAt": "2026-01-15T00:00:00.000Z",
      "updatedAt": "2026-01-15T00:00:00.000Z"
    }
  ]
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

#### `POST /api/admin/projects`

Create a new project.

**Request body:**

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "techStack": ["string"] ,
  "liveUrl": "string (optional)",
  "githubUrl": "string (optional)",
  "image": "string (optional)",
  "featured": "boolean (optional, default: false)",
  "sortOrder": "number (optional, default: 0)"
}
```

**Response `201`:**

```json
{
  "project": { "...Project object" }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

#### `PUT /api/admin/projects/:id`

Update an existing project. All fields are optional.

**URL parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Project ID (cuid) |

**Request body:**

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "techStack": ["string"],
  "liveUrl": "string (optional)",
  "githubUrl": "string (optional)",
  "image": "string (optional)",
  "featured": "boolean (optional)",
  "sortOrder": "number (optional)"
}
```

**Response `200`:**

```json
{
  "project": { "...Project object" }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

#### `DELETE /api/admin/projects/:id`

Delete a project.

**URL parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Project ID (cuid) |

**Response `200`:**

```json
{
  "success": true
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

### Admin: Experiences

#### `GET /api/admin/experiences`

List all experiences, ordered by `sortOrder` ascending.

**Response `200`:**

```json
{
  "experiences": [
    {
      "id": "cuid",
      "company": "Acme Corp",
      "role": "Senior Developer",
      "period": "2024 - Present",
      "description": "Led the frontend team...",
      "location": "Remote",
      "type": "Full-time",
      "current": true,
      "sortOrder": 0,
      "createdAt": "2026-01-15T00:00:00.000Z",
      "updatedAt": "2026-01-15T00:00:00.000Z"
    }
  ]
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

#### `POST /api/admin/experiences`

Create a new experience entry.

**Request body:**

```json
{
  "company": "string (required)",
  "role": "string (required)",
  "period": "string (required)",
  "description": "string (required)",
  "location": "string (optional)",
  "type": "string (optional)",
  "current": "boolean (required)",
  "sortOrder": "number (required)"
}
```

**Response `201`:**

```json
{
  "experience": { "...Experience object" }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

#### `PUT /api/admin/experiences/:id`

Update an existing experience. All fields are optional.

**URL parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Experience ID (cuid) |

**Request body:**

```json
{
  "company": "string (optional)",
  "role": "string (optional)",
  "period": "string (optional)",
  "description": "string (optional)",
  "location": "string (optional)",
  "type": "string (optional)",
  "current": "boolean (optional)",
  "sortOrder": "number (optional)"
}
```

**Response `200`:**

```json
{
  "experience": { "...Experience object" }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

#### `DELETE /api/admin/experiences/:id`

Delete an experience entry.

**URL parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Experience ID (cuid) |

**Response `200`:**

```json
{
  "success": true
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

### Admin: Skills

#### `GET /api/admin/skills`

List all skills, ordered by `sortOrder` ascending.

**Response `200`:**

```json
{
  "skills": [
    {
      "id": "cuid",
      "name": "TypeScript",
      "category": "Languages",
      "proficiency": 90,
      "sortOrder": 0,
      "createdAt": "2026-01-15T00:00:00.000Z",
      "updatedAt": "2026-01-15T00:00:00.000Z"
    }
  ]
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

#### `POST /api/admin/skills`

Create a new skill.

**Request body:**

```json
{
  "name": "string (required)",
  "category": "string (required)",
  "proficiency": "number (required, 0-100)",
  "sortOrder": "number (required)"
}
```

**Response `201`:**

```json
{
  "skill": { "...Skill object" }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

#### `PUT /api/admin/skills/:id`

Update an existing skill. All fields are optional.

**URL parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Skill ID (cuid) |

**Request body:**

```json
{
  "name": "string (optional)",
  "category": "string (optional)",
  "proficiency": "number (optional)",
  "sortOrder": "number (optional)"
}
```

**Response `200`:**

```json
{
  "skill": { "...Skill object" }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

#### `DELETE /api/admin/skills/:id`

Delete a skill.

**URL parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Skill ID (cuid) |

**Response `200`:**

```json
{
  "success": true
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

### Admin: Contacts

#### `GET /api/admin/contacts`

List all contact form submissions, ordered by `createdAt` descending (newest first).

**Response `200`:**

```json
{
  "contacts": [
    {
      "id": "cuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "subject": "Project inquiry",
      "message": "I'd like to discuss a project...",
      "read": false,
      "createdAt": "2026-01-15T00:00:00.000Z"
    }
  ]
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

#### `PATCH /api/admin/contacts`

Mark a contact submission as read or unread.

**Request body:**

```json
{
  "id": "string (required, contact submission ID)",
  "read": "boolean (required)"
}
```

**Response `200`:**

```json
{
  "contact": { "...ContactSubmission object" }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

### `GET /api/admin/stats`

Get aggregate dashboard statistics.

**Response `200`:**

```json
{
  "posts": 12,
  "projects": 5,
  "experiences": 3,
  "skills": 15,
  "contacts": 8,
  "unreadContacts": 2
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

### Admin: Settings

#### `GET /api/admin/settings`

List all site settings.

**Response `200`:**

```json
{
  "settings": [
    {
      "id": "cuid",
      "key": "siteTitle",
      "value": "My Portfolio",
      "createdAt": "2026-01-15T00:00:00.000Z",
      "updatedAt": "2026-01-15T00:00:00.000Z"
    }
  ]
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

#### `PUT /api/admin/settings`

Bulk upsert site settings. Each setting is created if it does not exist, or updated if it does.

**Request body:**

```json
{
  "settings": [
    {
      "key": "string (required, unique setting key)",
      "value": "string (required)"
    }
  ]
}
```

**Response `200`:**

```json
{
  "success": true
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 500 | Internal server error |

---

### `POST /api/blog`

Create a new blog post. (Admin only)

**Auth required:** Yes

**Request body:**

```json
{
  "slug": "string (required, unique)",
  "title": "string (required)",
  "excerpt": "string (required)",
  "content": "string (required)",
  "coverImage": "string (optional)",
  "tags": ["string"],
  "category": "string (optional)",
  "readingTime": "number (optional, default: 5)",
  "status": "string (optional, default: 'published')",
  "featured": "boolean (optional, default: false)"
}
```

**Response `201`:**

```json
{
  "post": { "...BlogPost object" }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 400 | Validation error (missing required fields) |
| 401 | Unauthorized |
| 409 | Slug already exists |
| 500 | Internal server error |

---

### `PUT /api/blog/:slug`

Update an existing blog post. (Admin only)

**Auth required:** Yes

**URL parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `slug` | string | The post's unique slug |

**Request body:**

```json
{
  "title": "string (optional)",
  "excerpt": "string (optional)",
  "content": "string (optional)",
  "coverImage": "string (optional)",
  "tags": ["string"],
  "category": "string (optional)",
  "readingTime": "number (optional)",
  "status": "string (optional)",
  "featured": "boolean (optional)"
}
```

**Response `200`:**

```json
{
  "post": { "...BlogPost object" }
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 404 | Post not found |
| 500 | Internal server error |

---

### `DELETE /api/blog/:slug`

Delete a blog post. (Admin only)

**Auth required:** Yes

**URL parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `slug` | string | The post's unique slug |

**Response `200`:**

```json
{
  "success": true
}
```

**Error codes:**

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 404 | Post not found |
| 500 | Internal server error |

---

## Data Models Reference

### BlogPost

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (cuid) |
| `slug` | string | URL-safe unique slug |
| `title` | string | Post title |
| `excerpt` | string | Short summary |
| `content` | string | Full post content |
| `coverImage` | string \| null | Cover image URL |
| `tags` | string[] | Array of tags |
| `category` | string \| null | Post category |
| `author` | string | Author name (default: "Umar Abdullah") |
| `publishedAt` | string | ISO 8601 timestamp |
| `featured` | boolean | Whether the post is featured |
| `readingTime` | number | Estimated reading time in minutes |
| `status` | string | Publication status (default: "published") |
| `createdAt` | string | ISO 8601 timestamp |
| `updatedAt` | string | ISO 8601 timestamp |

### Project

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (cuid) |
| `title` | string | Project title |
| `description` | string | Project description |
| `techStack` | string[] | Technologies used |
| `liveUrl` | string \| null | Live demo URL |
| `githubUrl` | string \| null | GitHub repository URL |
| `image` | string \| null | Project image URL |
| `featured` | boolean | Whether the project is featured |
| `sortOrder` | number | Display order |
| `createdAt` | string | ISO 8601 timestamp |
| `updatedAt` | string | ISO 8601 timestamp |

### Experience

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (cuid) |
| `company` | string | Company name |
| `role` | string | Job title/role |
| `period` | string | Employment period (e.g., "2024 - Present") |
| `description` | string | Role description |
| `location` | string \| null | Work location |
| `type` | string \| null | Employment type (e.g., "Full-time") |
| `current` | boolean | Whether this is a current position |
| `sortOrder` | number | Display order |
| `createdAt` | string | ISO 8601 timestamp |
| `updatedAt` | string | ISO 8601 timestamp |

### Skill

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (cuid) |
| `name` | string | Skill name |
| `category` | string | Skill category |
| `proficiency` | number | Proficiency level (0-100, default: 80) |
| `sortOrder` | number | Display order |
| `createdAt` | string | ISO 8601 timestamp |
| `updatedAt` | string | ISO 8601 timestamp |

### ContactSubmission

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (cuid) |
| `name` | string | Sender name |
| `email` | string | Sender email |
| `subject` | string \| null | Message subject |
| `message` | string | Message body |
| `read` | boolean | Whether the message has been read |
| `createdAt` | string | ISO 8601 timestamp |

### SiteSetting

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (cuid) |
| `key` | string | Unique setting key |
| `value` | string | Setting value |
| `createdAt` | string | ISO 8601 timestamp |
| `updatedAt` | string | ISO 8601 timestamp |

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/auth/login` | 5 attempts | 15 minutes (per IP) |
| `POST /api/contact` | 5 submissions | 15 minutes (per IP) |

Rate-limited responses return `429 Too Many Requests` with a `Retry-After` header indicating seconds until the limit resets.
