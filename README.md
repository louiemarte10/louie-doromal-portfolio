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
│   ├── resume/         # Printable A4 resume at /resume, builder at /resume/build
│   ├── globals.css     # Theme tokens, dark ground, motion, print rules
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

## Resume

`/resume` renders an A4 sheet from the same `src/data/resume.ts` the site uses, so
the resume and the portfolio can never disagree. The page is styled to print:
`@page` sets A4 with margins, the site chrome is `print:hidden`, and entries carry
`break-inside: avoid` so no role is split across pages.

`/resume/build` is a builder that renders the same sheet from whatever you type
into it, so anyone can produce a resume on this template. The form keeps its draft
in `localStorage` only — nothing is uploaded — and it is loaded with `ssr: false`,
since a saved draft and a photo picked through `FileReader` exist only in the
browser. Printing it hides the form and prints the sheet alone.

Both pages render `src/components/resume/ResumeSheet.tsx`, which takes a
`ResumeContent` (see `src/lib/resume-content.ts`); `ownerContent` maps
`src/data/resume.ts` onto that shape. One template, two sources of data.

### Printing

Two details matter and are easy to undo by accident:

- `@page` carries **vertical** margins only. The side gap is padding on the sheet,
  because picking "None" for margins in the print dialog zeroes `@page` and would
  otherwise clip the first character of every line.
- Bullets are real `list-disc` markers. A dot drawn as a span with a background
  colour disappears unless the visitor happens to tick "Background graphics".

`public/louie-doromal-resume.pdf` is the file behind the **Download PDF** button. It
is committed because Vercel's build has no browser to render it. After editing
`src/data/resume.ts`, regenerate it:

```bash
npm run resume:pdf
```

That builds the site, serves it locally, prints `/resume` with headless Chrome or
Edge, and writes the PDF back into `public/`. Set `CHROME_PATH` if neither browser
is found. The **Print** button on the page always reflects current data, even when
the committed PDF is behind.

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
npm run resume:pdf  # regenerate public/louie-doromal-resume.pdf
```
