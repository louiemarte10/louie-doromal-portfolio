export type TemplateId = "editorial" | "classic" | "sidebar" | "compact" | "banner";

/**
 * A template is a bundle of class names plus two structural choices, so all five
 * share one sheet component instead of five near-copies of the same markup.
 * The strings are literal here on purpose — Tailwind only generates classes it
 * can see in the source.
 */
export type Template = {
  id: TemplateId;
  label: string;
  note: string;
  layout: "single" | "sidebar";
  header: "split" | "centered" | "banner";
  /** Root font of the sheet. */
  font: string;
  /** Section heading, rule included. */
  heading: string;
  /** Name and role at the top. */
  name: string;
  role: string;
  /** Body copy and the smaller secondary copy. */
  body: string;
  small: string;
  /** Space above each section, and between entries within one. */
  section: string;
  entries: string;
  /** Bullet marker colour. */
  marker: string;
};

const MONO_HEADING =
  "mb-2 border-b border-paper-rule pb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-paper-accent";

export const templates: Template[] = [
  {
    id: "editorial",
    label: "Editorial",
    note: "Gold accents, mono labels. The one this portfolio uses.",
    layout: "single",
    header: "split",
    font: "",
    heading: MONO_HEADING,
    name: "text-[25px] font-semibold leading-tight tracking-tight",
    role: "mt-0.5 text-[13px] font-medium text-paper-accent",
    body: "text-[11px]",
    small: "text-[10.5px]",
    section: "mt-5",
    entries: "space-y-3.5",
    marker: "marker:text-paper-accent",
  },
  {
    id: "classic",
    label: "Classic",
    note: "Serif type, centred header, no colour. Safest for formal applications.",
    layout: "single",
    header: "centered",
    font: "font-serif",
    heading:
      "mb-2 border-b border-paper-ink/25 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-paper-ink",
    name: "text-[26px] font-bold leading-tight",
    role: "mt-1 text-[13px] italic text-paper-soft",
    body: "text-[11px]",
    small: "text-[10.5px]",
    section: "mt-5",
    entries: "space-y-3.5",
    marker: "marker:text-paper-ink",
  },
  {
    id: "sidebar",
    label: "Sidebar",
    note: "Skills and schooling in a left rail, experience beside it.",
    layout: "sidebar",
    header: "split",
    font: "",
    heading: MONO_HEADING,
    name: "text-[25px] font-semibold leading-tight tracking-tight",
    role: "mt-0.5 text-[13px] font-medium text-paper-accent",
    body: "text-[11px]",
    small: "text-[10.5px]",
    section: "mt-4",
    entries: "space-y-3",
    marker: "marker:text-paper-accent",
  },
  {
    id: "compact",
    label: "Compact",
    note: "Tighter type and spacing, for fitting a long history into fewer pages.",
    layout: "single",
    header: "split",
    font: "",
    heading:
      "mb-1.5 border-b border-paper-rule pb-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-paper-accent",
    name: "text-[21px] font-semibold leading-tight tracking-tight",
    role: "mt-0.5 text-[11.5px] font-medium text-paper-accent",
    body: "text-[10px]",
    small: "text-[9.5px]",
    section: "mt-3.5",
    entries: "space-y-2.5",
    marker: "marker:text-paper-accent",
  },
  {
    id: "banner",
    label: "Banner",
    note: "Dark header band with the name reversed out of it.",
    layout: "single",
    header: "banner",
    font: "",
    heading:
      "mb-2 border-b-2 border-paper-accent pb-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-paper-ink",
    name: "text-[26px] font-semibold leading-tight tracking-tight",
    role: "mt-0.5 text-[13px] font-medium text-accent-soft",
    body: "text-[11px]",
    small: "text-[10.5px]",
    section: "mt-5",
    entries: "space-y-3.5",
    marker: "marker:text-paper-accent",
  },
];

export const defaultTemplate = templates[0];

export function templateById(id: string | null | undefined): Template {
  return templates.find((template) => template.id === id) ?? defaultTemplate;
}

export type SurfaceId = "light" | "dark";

export type Surface = {
  id: SurfaceId;
  label: string;
  note: string;
};

/**
 * Applied as `data-surface` on the sheet, which redefines the paper colour
 * variables in globals.css. Dark prints as dark, so it suits a PDF that will be
 * read on screen more than one going through an office printer.
 */
export const surfaces: Surface[] = [
  { id: "light", label: "Light", note: "White paper. Prints cleanly." },
  { id: "dark", label: "Dark", note: "Dark paper. Best for a PDF read on screen." },
];

export const defaultSurface = surfaces[0];

export function surfaceById(id: string | null | undefined): Surface {
  return surfaces.find((surface) => surface.id === id) ?? defaultSurface;
}
