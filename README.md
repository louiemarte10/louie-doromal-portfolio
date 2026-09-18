# louie-doromal-portfolio

Personal portfolio site for **Louie M. Doromal** — AI Software Engineer, Iloilo City.

**Live:** https://louie-d-portfolio.vercel.app

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- Deployed on **Vercel**

## Structure

```
src/
├── app/
│   ├── layout.tsx      # Fonts, metadata, OpenGraph
│   ├── page.tsx        # Section composition + JSON-LD Person schema
│   ├── globals.css     # Theme tokens, dark ground, motion
│   └── icon.svg        # LD monogram favicon
├── components/
│   ├── Nav.tsx         # Sticky header
│   ├── Hero.tsx        # Name, role, stat strip
│   ├── About.tsx       # Summary + skill groups
│   ├── Experience.tsx  # Role timeline
│   ├── Projects.tsx    # Selected work
│   ├── RecentWork.tsx  # Live GitHub activity (server component)
│   ├── Background.tsx  # Education + awards
│   ├── Contact.tsx     # Contact grid + footer
│   └── Section.tsx     # Shared section shell
└── data/
    └── resume.ts       # All page content in one typed module
```

Every piece of copy lives in `src/data/resume.ts` — edit that file to update the site; no component changes needed.

## Live GitHub activity

The **Recent activity** section is a server component that calls the GitHub public API at render time, filters out forks and archived repos, and shows the six most recently pushed. It revalidates hourly (`next: { revalidate: 3600 }`) and falls back to a static snapshot in `repoFallback` if the API is unreachable, so a GitHub outage can never fail a build.

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```
