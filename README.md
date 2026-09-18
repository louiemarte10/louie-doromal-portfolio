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
into it, so anyone can produce a resume on this template. It is linked from the
**Resume builder** section on the landing page (`/#resume-builder`), separately
from my own resume. The form keeps its draft in `localStorage` only — nothing is
uploaded — and it is loaded with `ssr: false`, since a saved draft and a photo
picked through `FileReader` exist only in the browser. Printing it hides the form
and prints the sheet alone.

Both pages render `src/components/resume/ResumeSheet.tsx`, which takes a
`ResumeContent` (see `src/lib/resume-content.ts`) and a `Template`;
`ownerContent` maps `src/data/resume.ts` onto that shape.

The builder also offers a light or dark **background**. That is applied as
`data-surface` on the sheet, which redefines the `--color-paper-*` variables in
`globals.css` — which is why those tokens sit in a plain `@theme` block rather
than `@theme inline`: `inline` bakes the literal value into every utility, so
`bg-paper` could no longer be reassigned per element. Dark prints as dark, so it
suits a PDF read on screen more than one going to an office printer.

`src/lib/resume-templates.ts` holds the five templates the builder offers
(Editorial, Classic, Sidebar, Compact, Banner). A template is class names plus
two structural choices — `layout` (single column or left rail) and `header`
(split, centred or banner) — so one sheet component covers all five instead of
five near-copies. Those class strings must stay literal in that file: Tailwind
only generates classes it can see in the source. My own resume always uses
Editorial, which is what the committed PDF is printed from.

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

## Spoken introduction

The hero narrates `src/lib/voice-intro.ts` through the browser's own Web Speech
API — free, no key, and nothing leaves the machine. The script is kept apart from
the on-page copy because it is written for the ear: no dashes or abbreviations a
synthesiser would spell out.

It starts on its own, with a caveat worth knowing before changing this code:
**Chrome and Safari refuse audio until the page has been interacted with**, and
they are inconsistent about reporting that refusal. So the narration is attempted
on a short timer *and* on the visitor's first click or keypress, whichever lands
first, with an `onstart` flag making sure it only ever runs once. On Firefox it
usually begins immediately; on Chrome it begins at the first click. A
`sessionStorage` flag keeps it to once per tab, so returning from `/resume` does
not restart it, and the button doubles as a stop control.

The control is a small player: play or pause, a clock and a progress bar.
Progress comes from the utterance's real word-boundary events, falling back to
the elapsed clock where a browser does not send them, and the total is estimated
from the word count at 165 words a minute.

The bar is a real scrubber: click or drag it to jump. A recording is seeked
outright; synthesised speech cannot be, so the equivalent **character** offset is
spoken from instead, which tracks closely because the rate barely varies. Seeking
while paused moves the position without breaking the silence; from a standstill it
starts playing at that point. It is a styled `input[type=range]` rather than a div
with click maths, so dragging, keyboard arrows and the slider semantics come for
free — the `.scrub` rules in `globals.css` take `--played` from the component.

Pause holds its position. It does **not** use `speechSynthesis.pause()`, which is
quietly ignored for the network-backed voices this prefers — the narration simply
carries on. Instead the last word boundary is remembered and a resume speaks the
script from that offset, which works in every browser. Where boundary events are
missing the offset is estimated from the clock and snapped forward to a word, so
a resume never restarts from the top or begins mid-word. The script also narrates the featured projects straight from
`src/data/resume.ts`, so adding a project adds it to the narration; project names
are de-camel-cased for the ear, since "louieDevAgent" is unspeakable as written.

### Replacing the voice with a recording

**No synthesiser passes for a real person, and none can blend two accents.** The
Web Speech API hands over a fixed list of installed voices; rate, pitch and
volume are the only controls. So for a voice that is genuinely Filipino-American
and genuinely not obviously AI, record it.

Drop an `intro.mp3` into `public/` and it takes over on the next build — no code
change. `findRecordedIntro()` looks for it in a Server Component while the page
is built, so nothing is requested when it is absent. A recording also reports its
own duration and position, so the clock becomes exact rather than estimated.
`.m4a`, `.ogg` and `.wav` work too.

### Choosing a synthesised voice

`src/lib/pick-voice.ts` does this, and is import-free so it can be exercised on
its own. `SpeechSynthesisVoice` exposes neither gender nor accent, so both can
only be guessed from the name and language tag — and since **"female" contains
"male"**, female markers are ruled out before either is matched, or every
"... Female" voice would match as male.

Voices are ranked Philippine English, then a *neural* Filipino voice, then a
neural English one. Legacy Tagalog voices are deliberately ranked below American
English: they mispronounce English badly enough that the accent is not worth it.
In practice that resolves to Angelo on a Windows 11 machine with Filipino
installed, Guy Online (Natural) on Windows 11 without it, David on Windows 10 and
Alex on macOS.

## Local development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
npm run resume:pdf  # regenerate public/louie-doromal-resume.pdf
```
