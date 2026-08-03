# Umar Abdullah portfolio

Next.js portfolio and database-backed content manager for projects, writing, experience, skills, settings, and contact submissions.

## Local development

Copy `.env.example` to `.env.local`, provide a PostgreSQL connection and secrets, then run:

```bash
npm install
npm run db:deploy
npm run sync:projects
npm run dev
```

Open `http://localhost:3000`. The CMS is available under `/admin` after creating an account with `npm run db:create-admin`.

## Database and deployment

Git stores migrations and source content, not PostgreSQL records or secrets. Follow [docs/database-deployment.md](docs/database-deployment.md) to bootstrap a production database or transfer the exact local data safely.
