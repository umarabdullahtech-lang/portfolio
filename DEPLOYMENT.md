# Deployment Guide — Portfolio (umar-abdullah.com)

## Environments

| Environment | URL | Host |
|-------------|-----|------|
| Production | https://umar-abdullah.com | Azure Linux (this server) |
| Local dev | http://localhost:3000 | Developer machine |

## Prerequisites

- Node.js ≥ 20 (check: `node --version`)
- npm ≥ 10
- PostgreSQL ≥ 14
- nginx (production only)

## Local Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd portfolio

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in all values (see Environment Variables section)
chmod 600 .env

# 4. Set up the database
createdb portfolio_umar  # or use your PostgreSQL client
npx prisma migrate deploy

# 5. Seed initial data (creates admin user)
npx prisma db seed

# 6. Run in development mode
npm run dev
# App available at http://localhost:3000
```

## Environment Variables

See `.env.example` for the full list with descriptions. Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (TCP, not socket) |
| `JWT_SECRET` | JWT signing secret — generate with `openssl rand -base64 48` |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password (plain text in .env, bcrypt-hashed in DB) |

**Security requirements:**
- `.env` must have permissions `600` (`chmod 600 .env`)
- `JWT_SECRET` must be ≥32 bytes of random data
- Admin and DB passwords must be strong (≥16 chars, random)
- Rotate all credentials if exposure is suspected

## Database Setup

```bash
# Create the database
sudo -u postgres createdb portfolio_umar

# Run migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed

# Verify the admin user was created
sudo -u postgres psql -d portfolio_umar -c "SELECT email FROM admin_users;"
```

To reset admin password after rotation:

```bash
# 1. Generate bcrypt hash of the new password
node -e "require('bcryptjs').hash('NEW_PASSWORD', 10).then(h => console.log(h))"

# 2. Update in DB
sudo -u postgres psql -d portfolio_umar \
  -c "UPDATE admin_users SET password = 'HASH_FROM_STEP_1' WHERE email = 'admin@umar-abdullah.com';"

# 3. Update ADMIN_PASSWORD in .env and restart
sudo systemctl restart portfolio.service
```

## Deployment Process

### Build and deploy to production (manual)

```bash
# On the production server
cd /home/openclaw-assistant-jorge_user/projects/portfolio

# Pull latest changes
git pull origin main

# Install any new dependencies
npm ci --production=false

# Build for production
npm run build

# Restart the service
sudo systemctl restart portfolio.service

# Verify health
curl -s http://localhost:3001/api/health
```

### Deployment checklist

- [ ] `npm run build` completes without errors
- [ ] `.env` has all required variables set
- [ ] Database migrations applied (`npx prisma migrate deploy`)
- [ ] Service starts healthy (`sudo systemctl status portfolio.service`)
- [ ] Health endpoint returns 200 (`curl http://localhost:3001/api/health`)
- [ ] nginx config valid (`sudo nginx -t`)

## Rollback Procedures

```bash
# Rollback to previous git commit
git log --oneline -5  # find the target commit
git checkout <commit-hash>
npm ci --production=false
npm run build
sudo systemctl restart portfolio.service
```

For database rollback:

```bash
# Restore from latest backup
gunzip -c /home/openclaw-assistant-jorge_user/backups/portfolio-db/portfolio_umar_YYYYMMDD_HHMMSS.sql.gz \
  | sudo -u postgres psql -d portfolio_umar
```

## CI/CD Pipeline

Automated via GitHub Actions (`.github/workflows/deploy.yml`).

### Pipeline stages (on push to `main`)

| # | Stage | Tool |
|---|-------|------|
| 1 | Checkout | `actions/checkout@v4` |
| 2 | Install deps | `npm ci` |
| 3 | Lint | `npm run lint` |
| 4 | Build | `npm run build` |
| 5 | SSH deploy | `appleboy/ssh-action` |
| 6 | DB migrations | `npx prisma migrate deploy` (on server) |
| 7 | Restart service | `sudo systemctl restart portfolio.service` |
| 8 | Health check | `curl http://localhost:3001/api/health` (6 retries) |
| 9 | Rollback | Auto-rollback to previous commit on health-check failure |
| 10 | Failure notification | GitHub Issue created with run link |

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `PROD_SSH_HOST` | Production server hostname or IP |
| `PROD_SSH_USER` | SSH username (e.g. `openclaw-assistant-jorge_user`) |
| `PROD_SSH_PRIVATE_KEY` | Private key that matches a key in `~/.ssh/authorized_keys` on server |
| `PROD_SSH_PORT` | SSH port (defaults to 22 if not set) |
| `DATABASE_URL` | PostgreSQL connection string (used at build time) |
| `JWT_SECRET` | JWT signing secret (used at build time) |

### Pipeline logs

View at: `https://github.com/umarabdullahtech-lang/portfolio/actions`

## Monitoring

### Service status
```bash
sudo systemctl status portfolio.service
```

### Application logs
```bash
sudo journalctl -u portfolio.service -f
sudo journalctl -u portfolio.service --since "1 hour ago"
```

### Nginx logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health check
```bash
curl -s https://umar-abdullah.com/api/health
# Expected: {"status":"ok","db":"ok"}
```

### Database backup status
```bash
cat /home/openclaw-assistant-jorge_user/backups/portfolio-db/backup.log
ls -lh /home/openclaw-assistant-jorge_user/backups/portfolio-db/
```

## Database Backups

- **Schedule:** Daily at 02:00 UTC via `portfolio-backup.timer` (systemd)
- **Location:** `/home/openclaw-assistant-jorge_user/backups/portfolio-db/`
- **Retention:** 30 days
- **Format:** gzipped SQL dump (`.sql.gz`)

```bash
# Check timer status
sudo systemctl list-timers portfolio-backup.timer

# Run backup manually
/home/openclaw-assistant-jorge_user/backups/portfolio-db-backup.sh

# View backup log
cat /home/openclaw-assistant-jorge_user/backups/portfolio-db/backup.log
```

## Troubleshooting

### Service fails to start

```bash
sudo journalctl -u portfolio.service -n 50
# Common causes:
# - Missing or malformed .env
# - Port 3001 already in use: lsof -i :3001
# - Database unreachable: pg_isready -h 127.0.0.1 -p 5432
```

### Database connection errors

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql.service

# Test TCP connection (app uses TCP, not socket)
PGPASSWORD="<db-password>" psql -h 127.0.0.1 -U postgres -d portfolio_umar -c "SELECT 1;"

# Check pg_hba.conf allows TCP access
sudo cat /etc/postgresql/*/main/pg_hba.conf
```

### nginx 502 Bad Gateway

```bash
# Check the app is running
curl -s http://127.0.0.1:3001/api/health

# Check nginx config
sudo nginx -t
sudo systemctl reload nginx
```

### High error rate or slow responses

```bash
# Check recent errors
sudo journalctl -u portfolio.service --since "30 minutes ago" | grep -i error

# Check nginx access log for status codes
sudo awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -20
```
