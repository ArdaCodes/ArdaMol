# Arda Mol — The Castle of Ideas

A premium, cinematic, parallax personal blog & notes platform with a real
admin panel behind authentication.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Prisma** + **SQLite** (file-based database — no server to install)
- **NextAuth** (credentials login) for the admin panel
- **Framer Motion** for the parallax hero and scroll reveals
- **react-markdown** for rendering note content

## 1. Install dependencies

```bash
npm install
```

## 2. Set up the database

The project uses a local SQLite file, so there is nothing to install or
configure beyond this repo.

```bash
npx prisma db push     # creates dev.db with all tables
npm run db:seed        # creates the admin user + demo notes/projects
```

The seed script prints the admin login it just created (from `.env`).

## 3. Environment variables

Already set in `.env` for local development — change these before deploying:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="change-this-to-a-long-random-string-in-production"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="arda@ardamol.com"
ADMIN_PASSWORD="castle-of-ideas-2026"
```

- `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — used only when you run `npm run db:seed`;
  changing them afterwards requires re-running the seed (or editing the user
  directly).

## 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` for the site and
`http://localhost:3000/admin/login` for the admin panel.

## 5. Admin login

```
Email:    arda@ardamol.com
Password: castle-of-ideas-2026
```

From the admin panel you can manage:

- **Posts** — create, edit, autosave, publish/unpublish, delete
- **Categories** & **Tags**
- **Media** — upload JPG/PNG/WEBP images, copy their URLs
- **Projects**
- **Pages** — homepage hero tagline & about blurb
- **Appearance** — default theme/accent for new visitors
- **Settings** — site title, description, social links

The post editor supports Markdown with a formatting toolbar (bold, italic,
links, quotes, lists, inline & block code, images from the media library,
image galleries, dividers, and YouTube/Vimeo embeds), autosaves your draft a
couple of seconds after you stop typing, and shows a Saving…/Saved indicator.

## 6. Production build

```bash
npm run build
npm start
```

`npm run build` runs `prisma generate` automatically first. If you're
deploying to a fresh server/container, run `npx prisma db push` once against
the production `DATABASE_URL` before starting the app (and `npm run db:seed`
if you want the demo content — otherwise skip seeding and add your own posts
from `/admin`).

## 7. Deploying with your own domain

1. Deploy the app (Vercel, a VPS, Docker — any Node host works since this
   uses SQLite, though for serverless platforms like Vercel you'll want to
   swap `DATABASE_URL` to a hosted Postgres/MySQL/Turso database instead,
   since serverless functions don't have a persistent filesystem for a
   SQLite file).
2. Point your domain's DNS to the host (an `A`/`CNAME` record, depending on
   the provider).
3. Set `NEXTAUTH_URL` to your real domain (`https://ardamol.com`) and
   generate a fresh `NEXTAUTH_SECRET`.
4. Re-run `npx prisma db push` (and seed, if needed) against the production
   database.
5. Update the `metadataBase` URL in `app/layout.tsx` and the URLs in
   `app/sitemap.ts` / `app/robots.ts` to match your real domain.

## Project structure

```
app/
  (site)/            → public site (uses Header/Footer layout)
    page.tsx           → homepage (parallax hero, about, featured/latest notes, projects, timeline)
    notes/             → notes listing + [slug] detail page
    projects/          → projects page
    archive/           → year/month archive
  admin/               → admin panel (own layout, sidebar, auth-protected)
    login/, posts/, categories/, tags/, media/, projects/, pages/, appearance/, settings/
  api/                 → route handlers (posts, categories, tags, projects, media, upload, search, settings, auth)
components/            → shared UI (Header, Footer, ParallaxHero, NoteCard, PostEditor, etc.)
lib/                   → prisma client, auth config, data-fetching helpers
prisma/                → schema.prisma + seed.ts
```

## Notes on images

Demo content uses royalty-free Unsplash images loaded remotely. Anything you
upload through the Media Library in `/admin` is stored in `public/uploads/`
on your server, so make sure that folder persists across deploys (or point
uploads at a proper object store like S3 if you move to a serverless host).
