# Database deployment and data transfer

The Git repository contains the Prisma schema, migrations, and the 108-project source catalog. It does **not** contain PostgreSQL records, admin passwords, `.env.local`, or the local Docker volume.

## Production database

Provision a managed PostgreSQL database, then add these secrets to the hosting provider using `.env.example` as the key list:

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME` (optional)

Never commit the real values.

For a clean database, run:

```bash
npm ci
npm run db:deploy
npm run sync:projects
npm run db:create-admin
```

`postinstall` generates the Prisma client during a clean deployment. `db:deploy` applies committed migrations. `sync:projects` imports all 108 project case studies, including projects without live URLs. `db:create-admin` securely creates or rotates the configured admin account.

> `sync:projects` intentionally upserts the source catalog into PostgreSQL. After editors begin changing those same projects in the admin panel, only run it when you intend to replace those project fields with the repository version.

## Move the exact local data

The clean bootstrap does not reproduce later admin changes, users, blog edits, settings, experiences, skills, or contact submissions. To carry the exact database state, first create a custom-format dump:

```powershell
npm run db:backup
```

The backup is written under `backups/`, verified with `pg_restore`, and ignored by Git. Transfer it through a private channel, then restore it into an empty production database with PostgreSQL client tools:

```bash
pg_restore --clean --if-exists --no-owner --no-privileges \
  --dbname="$DATABASE_URL" backups/portfolio-YYYYMMDD-HHMMSS.dump
npm run db:deploy
```

The dump includes admin password hashes and any private submissions, so do not upload it to GitHub or other public storage.

## Ongoing protection

Enable automated backups and point-in-time recovery with the database provider. Take a manual `npm run db:backup` snapshot before schema migrations or bulk admin edits, and keep at least one encrypted off-site copy.
