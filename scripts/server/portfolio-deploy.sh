#!/usr/bin/env bash
# Production deploy for umar-abdullah.com on the Azure VM (portfolio-vm).
#
# Installed as root-owned /usr/local/sbin/portfolio-deploy. GitHub Actions runs it through
# the portfolio-deploy SSH user, whose key can only execute this script. To deploy by hand:
#   sudo /usr/local/sbin/portfolio-deploy
#   sudo FORCE=1 /usr/local/sbin/portfolio-deploy   (rebuilds even if main has not moved)
#
# The live app keeps serving while the next build is prepared beside it. The database is
# backed up before migrating, the folders are swapped, and a failed health check restores
# the previous build automatically. Migrations must stay compatible with the previous build,
# because they run before the swap.
set -euo pipefail

ROOT=/srv/portfolio
LIVE=$ROOT/app
NEXT=$ROOT/app-next
PREV=$ROOT/app-prev
BACKUPS=$ROOT/backups
SERVICE=portfolio.service
HEALTH_URL=http://127.0.0.1:3000/api/health
LOG=/var/log/portfolio-deploy.log

exec 9>/var/lock/portfolio-deploy.lock
if ! flock -n 9; then echo "Another deploy is already running"; exit 1; fi

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" | tee -a "$LOG"; }
as_app() { sudo -u portfolio -H bash -c "$1"; }
fail() { log "DEPLOY FAILED: $*"; exit 1; }

log "=== Deploy started"
rm -rf "$NEXT"
rsync -a --exclude node_modules --exclude .next "$LIVE/" "$NEXT/"
as_app "cd '$NEXT' && git pull --ff-only --quiet origin main" || fail "git pull"

OLD=$(as_app "git -C '$LIVE' rev-parse --short HEAD")
NEW=$(as_app "git -C '$NEXT' rev-parse --short HEAD")
if [ "$OLD" = "$NEW" ] && [ "${FORCE:-0}" != "1" ]; then
  rm -rf "$NEXT"
  log "Already live at $NEW, nothing to deploy"
  exit 0
fi
log "Building $NEW (live: $OLD)"

as_app "cd '$NEXT' && npm ci --no-audit --no-fund --loglevel=error && npm run build" || fail "install/build (live site untouched)"
# Next records the folder it was built in; point those manifests at the live path.
sed -i "s#$NEXT#$LIVE#g" "$NEXT/.next/required-server-files.json" "$NEXT/.next/required-server-files.js"

mkdir -p "$BACKUPS" && chmod 700 "$BACKUPS"
DB=$(sed -n 's#^DATABASE_URL="\{0,1\}postgres[^/]*//[^/]*/\([^?"]*\).*#\1#p' "$LIVE/.env")
BACKUP_FILE="$BACKUPS/portfolio-$(date -u +%Y%m%dT%H%M%SZ)-before-$NEW.dump"
sudo -u postgres pg_dump -Fc "$DB" > "$BACKUP_FILE" || fail "database backup (live site untouched)"
chmod 600 "$BACKUP_FILE"
ls -1t "$BACKUPS"/portfolio-*.dump 2>/dev/null | tail -n +31 | xargs -r rm -f
log "Database backed up to $BACKUP_FILE"

as_app "cd '$NEXT' && npx prisma migrate deploy" || fail "migration (live site untouched; restore from $BACKUP_FILE if needed)"

rm -rf "$PREV"
mv "$LIVE" "$PREV"
mv "$NEXT" "$LIVE"
systemctl restart "$SERVICE"

for attempt in $(seq 1 20); do
  sleep 3
  if [ "$(curl -s -o /dev/null -w '%{http_code}' "$HEALTH_URL" || true)" = "200" ]; then
    log "Deploy complete: $NEW is live (health check passed after ~$((attempt * 3))s); previous build kept at $PREV"
    exit 0
  fi
done

log "Health check failed for $NEW, restoring $OLD"
FAILED="$ROOT/app-failed-$NEW"
rm -rf "$FAILED"
mv "$LIVE" "$FAILED"
mv "$PREV" "$LIVE"
systemctl restart "$SERVICE"
sleep 5
log "Rolled back to $OLD (health: $(curl -s -o /dev/null -w '%{http_code}' "$HEALTH_URL" || true)); failed build kept at $FAILED"
exit 1
