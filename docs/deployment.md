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

## Video uploads (one-time nginx setting)

Videos uploaded from the admin panel are saved on the server in `backend/uploads/videos` and served at `/uploads/videos/<file>`. The app accepts up to 2 GB, but nginx limits every request to 50 MB (`client_max_body_size 50M`), so larger uploads are rejected with HTTP 413 until nginx allows them on the upload routes.

In `/etc/nginx/sites-enabled/shootatsightweddings.com`, inside the `server { ... listen 443 ssl; }` block and directly after `client_max_body_size 50M;`, add:

```nginx
    # Admin video uploads (saved on this server): allow up to 2 GB.
    location ~ ^/api/(videos/upload|admin/upload-video)$ {
        client_max_body_size 2G;
        proxy_read_timeout 600s;
        proxy_send_timeout 600s;
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
```

Back up the file first, then run `nginx -t` and, only if it passes, `systemctl reload nginx`.

### Automatic video optimisation (install ffmpeg once)

When ffmpeg is installed on the server, every uploaded video is converted in the background into a web-friendly MP4: longest side 1080p (1920 px), H.264/AAC, set to start playing before it fully downloads. Videos are processed one at a time, at low CPU priority, so the site stays responsive. On this server a long 4K film can take several minutes.

- The URL the admin saves stays the same. An MP4 plays immediately and is swapped for the smaller version when ready (only if it is smaller). A MOV/WebM becomes playable at its `.mp4` URL once converted.
- If conversion fails, the original upload is kept.
- Pending conversions are recorded in `backend/uploads/videos/.jobs.json` and resume after a restart or deploy.
- Admins can check a video with `GET /api/videos/status/<id>`.

Install once on the VPS, then restart the app so it detects ffmpeg:

```bash
apt-get update && apt-get install -y ffmpeg
pm2 reload shootatsight --update-env
```

The app log then shows "ffmpeg found: uploaded videos will be optimised for the web." Without ffmpeg, uploads are simply kept as uploaded.

`backend/uploads` (photos and videos added through the admin) and `backend/media` (the site's own photos and videos) are not in Git; include both in server backups.
