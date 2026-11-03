# Shoot At Sight Weddings

Client website built with React, Vite, Express and MongoDB. Photos and direct MP4 videos are hosted on Cloudflare R2.

## Local setup

Use Node.js 22.12 or newer. From the repository root:

```powershell
npm ci
Copy-Item backend/.env.example backend/.env
```

Edit `backend/.env` with the client's MongoDB connection, a unique `JWT_SECRET`, and Cloudflare R2 credentials. Never commit this file. Generate a JWT secret with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

For the initial admin, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in that file. The backend creates the admin only when the database has no admin; there are no fallback login credentials. You can also run `npm run seed-admin` explicitly. Changing these variables does not change an existing admin's password.

Start the backend in one terminal:

```powershell
npm run dev:backend
```

Start the frontend in a second terminal:

```powershell
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173`. Saved frontend changes reload automatically. The local API runs at `http://localhost:5000/api`. `frontend/.env.example` documents an optional API URL override.

MongoDB is required for admin login and saving website configuration. Some public pages have built-in content and a local shoot-data fallback, but this does not replace MongoDB for the CMS.

## Cloudflare video settings

In the admin dashboard's site editor:

- **Hero Header:** enter desktop and mobile public Cloudflare R2 MP4 URLs.
- **Featured Film:** enter a video URL and poster image URL.
- **Films page:** enter each film's own video and poster URLs. Films without video URLs display “Coming soon”.

Use complete public HTTPS media URLs, not YouTube IDs or Cloudflare Stream IDs. Upload files to the client's R2 bucket first; these fields reference existing files. R2 access keys remain on the backend. Cloudflare must allow browser access to the public media URLs.

The source currently references an existing public R2 media host. Those references are preserved to keep existing photos and the homepage teaser available; moving Git repositories does not transfer the bucket or its ownership. Configure the client's storage and update the saved URLs when moving those assets.

## Production

Run `npm run lint` to check the frontend before building.
Run `npm test` for SEO metadata, legacy-data compatibility, gallery alignment and page-access regression tests. See [the SEO publishing handoff](docs/seo-handoff.md) for admin editing, content publication and the remaining edge-host redirect configuration.

```powershell
npm run build
```

The build produces `frontend/dist`, prerenders public routes and generates a sitemap. It needs Chromium (installed by the frontend postinstall script) and access to the API/media used for prerendering. To install Chromium manually, run `npx playwright install chromium` from `frontend`.

Set `NODE_ENV=production`, `PORT`, `MONGO_URI`, `JWT_SECRET`, and the R2 environment variables on the hosting service, then run:

```powershell
npm start
```

Express serves both the built frontend and `/api`. Configure the client's domain and persistent upload storage if using the local upload fallback. Database records, uploaded media, hosting configuration and secrets are managed separately from Git.

## Layout

- `frontend/src`: public website and admin dashboard.
- `frontend/public`: fonts, icons and static assets.
- `backend/src`: API routes, models and services.
- `backend/scripts/seed-admin.js`: explicit admin setup.
- `backend/migrate-to-mongo.js`: optional import of the bundled shoot-data fallback.
- `common`: retained source photography assets.

The client repository starts with a clean source snapshot. Previous Git history remains in the original repository. Local environment files, dependencies, builds, proposal documents and scratch/generated optimization files are excluded.
