#!/usr/bin/env bash
# Runs ON THE VPS (piped over SSH by .github/workflows/deploy.yml).
#
# Required environment:
#   APP_DIR      the site's git checkout on the server
#   RESTART_CMD  how to restart the Node app (e.g. "pm2 reload shoot-at-sight")
#   DEPLOY_SHA   the commit to release
#
# Safety: the running app is only restarted after a successful build. If
# anything fails before that, the previous code and build are restored and the
# site keeps serving the old version.
set -Eeuo pipefail

: "${APP_DIR:?APP_DIR is not set}"
: "${RESTART_CMD:?RESTART_CMD is not set}"
: "${DEPLOY_SHA:?DEPLOY_SHA is not set}"
EXPECTED_REPO="shootatsightweddings-dev/shootatsightweddings-website"

# Non-interactive SSH shells often skip nvm/profile setup.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

log() { printf '\n==> %s\n' "$*"; }

cd "$APP_DIR"

remote_url=$(git remote get-url origin)
case "$remote_url" in
  *"$EXPECTED_REPO"*) ;;
  *) echo "The server checkout pulls from $remote_url, expected $EXPECTED_REPO. Fix with: git remote set-url origin https://github.com/$EXPECTED_REPO.git" >&2; exit 1 ;;
esac

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "The server has uncommitted changes to tracked files. Commit or discard them first; refusing to overwrite:" >&2
  git status --short --untracked-files=no >&2
  exit 1
fi

previous_sha=$(git rev-parse HEAD)
backup="frontend/dist.previous"

rollback() {
  set +e
  echo >&2
  echo "!! Deploy failed. Restoring the previous code ($previous_sha) and build; the live site was not restarted." >&2
  git reset --quiet --hard "$previous_sha"
  if [ -d "$backup" ]; then rm -rf frontend/dist && mv "$backup" frontend/dist; fi
  npm ci --no-audit --no-fund > /dev/null 2>&1 || echo "!! Reinstalling the previous dependencies failed; run npm ci in $APP_DIR before the next restart." >&2
  exit 1
}

log "Node $(node -v), npm $(npm -v)"
log "Fetching $DEPLOY_SHA (currently on ${previous_sha:0:7})"
git fetch --quiet origin main
git checkout --quiet main
trap rollback ERR
git merge --quiet --ff-only "$DEPLOY_SHA"

log "Backing up the current build"
rm -rf "$backup"
if [ -d frontend/dist ]; then cp -a frontend/dist "$backup"; fi

log "Installing dependencies"
npm ci --no-audit --no-fund

log "Building and prerendering"
npm run build

trap - ERR

log "Restarting the app: $RESTART_CMD"
bash -c "$RESTART_CMD"

rm -rf "$backup"
log "Released $(git rev-parse --short HEAD): $(git log -1 --format=%s)"
