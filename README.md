# Shoot At Sight Weddings

Client website built with React, Vite, Express and MongoDB. Everything runs on the client's BigRock VPS: the site, the database, and all photos and videos. No outside storage service is used.

## Local setup

Use Node.js 22.12 or newer. From the repository root:

```powershell
npm ci
Copy-Item backend/.env.example backend/.env
```

Edit `backend/.env` with the MongoDB connection and a unique `JWT_SECRET`. Never commit this file. Generate a JWT secret with:

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

## Photos and videos

All media is stored on the VPS and served by Express from the same domain:

- `backend/media/`: the site's photos and videos, served at their folder paths (e.g. `/common/team.webp`, `/Naveen%20%26%20Kate%204K%20Teaser.mp4`). This folder is not in Git; it lives only on the server, so include it in server backups.
- `backend/uploads/`: images uploaded through the admin panel, served at `/uploads/<file>.webp`. Also not in Git.

In the admin dashboard's site editor, video and poster fields take a path on this site (e.g. `/your-film.mp4`) or a complete HTTPS URL. YouTube links and IDs are not accepted, because these fields play MP4 files directly. To add a new film, copy the MP4 into `backend/media/` on the server, then enter its path.

- **Hero Header:** desktop and mobile video paths.
- **Featured Film:** a video path and a poster image path.
- **Films page:** each film's own video and poster. Films without a video display “Coming soon”.

## Production

Run `npm run lint` to check the frontend before building.
Run `npm test` for SEO metadata, legacy-data compatibility, gallery alignment and page-access regression tests. See [the SEO publishing handoff](docs/seo-handoff.md) for admin editing, content publication and the remaining edge-host redirect configuration.

```powershell
npm run build
```

The build produces `frontend/dist`, prerenders public routes and generates a sitemap. It needs Chromium (installed by the frontend postinstall script) and access to the API/media used for prerendering. To install Chromium manually, run `npx playwright install chromium` from `frontend`.

Set `NODE_ENV=production`, `PORT`, `MONGO_URI` and `JWT_SECRET` in `backend/.env` on the server, then run:

```powershell
npm start
```

Express serves the built frontend, `/api`, and the media folders. Pushes to `main` deploy automatically; see [docs/deployment.md](docs/deployment.md). Database records, `backend/media`, `backend/uploads`, hosting configuration and secrets are managed separately from Git.

## Layout

- `frontend/src`: public website and admin dashboard.
- `frontend/public`: fonts, icons and static assets.
- `backend/src`: API routes, models and services.
- `backend/scripts/seed-admin.js`: explicit admin setup.
- `backend/migrate-to-mongo.js`: optional import of the bundled shoot-data fallback.
- `common`: retained source photography assets.

The client repository starts with a clean source snapshot. Previous Git history remains in the original repository. Local environment files, dependencies, builds, proposal documents and scratch/generated optimization files are excluded.
