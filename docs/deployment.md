# Deployment (BigRock VPS)

The live site runs on a BigRock VPS behind nginx. Pushing to `main` deploys it automatically through `.github/workflows/deploy.yml`:

1. **Check** (on GitHub): install, lint, test and compile the frontend. A push that fails here never reaches the server.
2. **Deploy** (on the VPS, over SSH): `scripts/deploy.sh` pulls that exact commit, runs `npm ci` and `npm run build` (including prerendering, which needs the production database), then restarts the app.
3. **Verify**: the workflow checks `/api/health` and the homepage on the live domain.

If the install or build fails on the server, the script restores the previous code and build and does **not** restart the app, so the site keeps serving the last good version. Deploys run one at a time.

You can also start a deploy by hand: **Actions → Deploy to BigRock VPS → Run workflow**.

## One-time setup

You need admin access to this GitHub repository and SSH access to the VPS.

### 1. Make sure the server checkout uses this repository

On the VPS, in the site folder:

```bash
git remote get-url origin
# if it is not this repository:
git remote set-url origin https://github.com/shootatsightweddings-dev/shootatsightweddings-website.git
git status   # must show no modified tracked files
```

The deploy refuses to run if the server has uncommitted changes to tracked files (`.env` and other ignored files are fine).

### 2. Create a deploy key for GitHub

On the VPS, as the user that owns the site folder:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_actions_deploy -N "" -C "github-actions-deploy"
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
cat ~/.ssh/github_actions_deploy        # copy this whole private key for the VPS_SSH_KEY secret
```

Then get the server's host key line for `VPS_KNOWN_HOSTS`, from your own computer:

```bash
ssh-keyscan -t ed25519 66.116.254.168
```

Check it matches the fingerprint the server reports for itself (`ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` on the VPS) before saving it.

### 3. Add the settings in GitHub

**Settings → Secrets and variables → Actions**

| Type | Name | Value |
|---|---|---|
| Secret | `VPS_HOST` | `66.116.254.168` |
| Secret | `VPS_USER` | the SSH user that owns the site folder |
| Secret | `VPS_SSH_KEY` | the private key from step 2 |
| Secret | `VPS_KNOWN_HOSTS` | the `ssh-keyscan` line from step 2 |
| Variable | `APP_DIR` | full path of the site folder on the VPS |
| Variable | `RESTART_CMD` | how the app is restarted, e.g. `pm2 reload shoot-at-sight` or `sudo systemctl restart shoot-at-sight` |
| Variable | `VPS_PORT` | optional, only if SSH is not on port 22 |

If `RESTART_CMD` uses `sudo`, allow that one command without a password for the deploy user (via `visudo`), because the workflow cannot type a password.

The workflow fails with a clear "Deploy is not configured" message until these are set.

### 4. Optional: require approval

**Settings → Environments → production** → add required reviewers if someone should approve each release.

## Server requirements

- Node.js 22.12 or newer on the `PATH` for non-interactive SSH sessions (nvm is loaded automatically if installed in `~/.nvm`).
- Playwright's Chromium installed for prerendering (`npx playwright install --with-deps chromium`, once).
- `backend/.env` with a working database connection: prerendering fails without it, and the deploy then rolls back.
