# Deployment Guide — Portfolio (umar-abdullah.com)

## Environments

| Environment | URL | Host |
|-------------|-----|------|
| Production | https://umar-abdullah.com | Azure VM `portfolio-vm` (resource group `portfolio-rg`, 20.204.138.40). App in `/srv/portfolio/app`, run by `portfolio.service` as user `portfolio` on 127.0.0.1:3000 behind nginx. The VM also hosts AM PUMPS (`am-pumps-frontend.service`, ports 3001/5000). |
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

Every deploy, automatic or manual, runs the same root-owned script on the VM:
`/usr/local/sbin/portfolio-deploy` (source: `scripts/server/portfolio-deploy.sh`). It:

1. Copies the live app to `/srv/portfolio/app-next` and pulls `main` there (the live site keeps serving).
2. Stops early if `main` is already live (`FORCE=1` rebuilds anyway).
3. Runs `npm ci` and `npm run build` in the copy.
4. Backs up the database to `/srv/portfolio/backups/` (newest 30 kept), then runs `npx prisma migrate deploy`.
5. Swaps folders (`app` → `app-prev`, `app-next` → `app`) and restarts `portfolio.service`.
6. Health-checks `http://127.0.0.1:3000/api/health` and restores `app-prev` automatically if it fails.

Migrations run before the swap, so they must stay compatible with the previous build.
Each step is logged to `/var/log/portfolio-deploy.log`.

### Deploy by hand

```bash
ssh azureuser@20.204.138.40
sudo /usr/local/sbin/portfolio-deploy
# or rebuild the current commit:
sudo FORCE=1 /usr/local/sbin/portfolio-deploy
```

To change the script, edit `scripts/server/portfolio-deploy.sh` and reinstall it:
`sudo install -o root -g root -m 755 portfolio-deploy.sh /usr/local/sbin/portfolio-deploy`.

## Rollback Procedures

### Automatic rollback

| Scenario | What happens |
|----------|-------------|
| Pull, install, build, backup, or migration fails | The deploy stops before the swap. The live site is untouched. |
| Health check fails after the restart | The previous build in `/srv/portfolio/app-prev` is moved back and the service restarted. The failed build is kept as `/srv/portfolio/app-failed-<commit>`. |

A failed GitHub Actions run also opens an issue labeled `deploy-failure` with a link to the run.
Database migrations are not reversed automatically; restore from the backup taken just before them.

### Manual rollback

```bash
# Return to the previous build (kept after every successful deploy)
sudo mv /srv/portfolio/app /srv/portfolio/app-rolled-back
sudo mv /srv/portfolio/app-prev /srv/portfolio/app
sudo systemctl restart portfolio.service
```

For database rollback:

```bash
# Restore a pre-deploy backup (custom format, made with pg_dump -Fc)
sudo ls -lt /srv/portfolio/backups/
sudo cat /srv/portfolio/backups/<file>.dump | sudo -u postgres pg_restore --clean --if-exists -d portfolio
```

## CI/CD Pipeline

Automated via GitHub Actions (`.github/workflows/deploy.yml`).

### Pipeline stages (on push to `main`, or run manually from the Actions tab)

| # | Stage | What runs |
|---|-------|------|
| 1 | Checkout, install, lint, build | `npm ci`, `npm run lint`, `npm run build` on the runner (a check only) |
| 2 | Deploy | `ssh portfolio-deploy@20.204.138.40` with strict host-key checking |
| 3 | On the server | `/usr/local/sbin/portfolio-deploy` (see Deployment Process) |
| 4 | On failure | GitHub Issue labeled `deploy-failure` with the run link |

Deploys never overlap: the workflow uses a `production-deploy` concurrency group and the
script holds a lock.

### Deploy identity on the VM

- User `portfolio-deploy`, created only for deploys.
- Its key in `/home/portfolio-deploy/.ssh/authorized_keys` is marked
  `restrict,command="sudo /usr/local/sbin/portfolio-deploy"`, so whatever a client asks for,
  it can only run the deploy script: no shell, no forwarding.
- `/etc/sudoers.d/portfolio-deploy` allows that one script as root, with no arguments.

To rotate the key: generate a new ed25519 pair, replace the key in `authorized_keys`
(keep the `restrict,command=...` prefix), and update the `PROD_SSH_PRIVATE_KEY` secret.

### GitHub Secrets

| Secret | Value |
|--------|-------------|
| `PROD_SSH_HOST` | `20.204.138.40` |
| `PROD_SSH_USER` | `portfolio-deploy` |
| `PROD_SSH_PRIVATE_KEY` | Private half of the deploy key (exists only in GitHub) |
| `PROD_SSH_KNOWN_HOSTS` | `ssh-keyscan -t ed25519 20.204.138.40` output; fingerprint `SHA256:yVVO+MAEWvQCQLthVmJb8p4881m5opC+9zvxNscISpU` |
| `PROD_SSH_PORT` | Optional, defaults to 22 |
| `JWT_SECRET` | Any random value. It only lets the runner's check build load the auth module; the server uses its own `.env`. |

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

### Deploy log
```bash
sudo tail -50 /var/log/portfolio-deploy.log
```

## Database Backups

- **When:** before every deploy, by the deploy script. There is no daily backup timer on
  `portfolio-vm`, so data changed between deploys (contact messages, /admin edits) is not
  backed up until the next deploy.
- **Location:** `/srv/portfolio/backups/` (root-only), newest 30 kept
- **Format:** PostgreSQL custom format (`pg_dump -Fc`)

```bash
# Take a backup now
sudo sh -c 'sudo -u postgres pg_dump -Fc portfolio > /srv/portfolio/backups/portfolio-manual-$(date -u +%Y%m%dT%H%M%SZ).dump'

# List backups
sudo ls -lh /srv/portfolio/backups/
```

## Troubleshooting

### Service fails to start

```bash
sudo journalctl -u portfolio.service -n 50
# Common causes:
# - Missing or malformed .env
# - Port 3000 already in use: sudo ss -ltnp | grep :3000
# - Database unreachable: pg_isready -h 127.0.0.1 -p 5432
```

### Database connection errors

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql.service

# Test TCP connection (app uses TCP, not socket)
sudo -u postgres psql -d portfolio -c "SELECT 1;"

# Check pg_hba.conf allows TCP access
sudo cat /etc/postgresql/*/main/pg_hba.conf
```

### nginx 502 Bad Gateway

```bash
# Check the app is running
curl -s http://127.0.0.1:3000/api/health

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
