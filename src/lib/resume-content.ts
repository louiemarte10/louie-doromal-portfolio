import {
  awards,
  certification,
  education,
  experience,
  profile,
  projects,
  references,
  skillGroups,
} from "@/data/resume";

/**
 * The shape the resume template renders. Kept separate from `@/data/resume` so
 * the same sheet can render the owner's resume and one typed into the builder.
 */
export type ResumeContent = {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  /** Full URLs; the sheet prints the address itself, since paper has no links. */
  links: string[];
  photo: string | null;
  profile: string[];
  skills: { title: string; items: string[] }[];
  experience: {
    title: string;
    company: string;
    period: string;
    summary: string;
    points: string[];
    tags: string[];
  }[];
  projects: { name: string; url: string; blurb: string; stack: string[] }[];
  education: { degree: string; school: string; period: string }[];
  awards: { title: string; issuer: string; date: string }[];
  references: { name: string; title: string; phone: string }[];
  certification: string;
};

export const ownerContent: ResumeContent = {
  name: profile.name,
  role: profile.role,
  location: profile.location,
  email: profile.email,
  phone: profile.phone,
  links: [profile.github, profile.linkedin],
  photo: "/lou.png",
  profile: [...profile.summary],
  skills: skillGroups.map((group) => ({
    title: group.title,
    items: [...group.items],
  })),
  experience: experience.map((role) => ({
    title: role.title,
    company: role.company,
    period: role.period,
    summary: role.summary,
    points: [...role.points],
    tags: [...role.tags],
  })),
  projects: projects
    .filter((project) => project.featured)
    .map((project) => ({
      name: project.name,
      url: project.live ?? project.href ?? "",
      blurb: project.blurb,
      stack: [...project.stack],
    })),
  education: education.map((entry) => ({
    degree: entry.degree,
    school: entry.school,
    period: entry.period,
  })),
  awards: awards.map((award) => ({
    title: award.title,
    issuer: award.issuer,
    date: award.date,
  })),
  references: references.map((person) => ({
    name: person.name,
    title: person.title,
    phone: person.phone,
  })),
  certification,
};

/** One blank row per repeatable section, so the builder opens with something to fill. */
export const blankContent: ResumeContent = {
  name: "",
  role: "",
  location: "",
  email: "",
  phone: "",
  links: [""],
  photo: null,
  profile: [""],
  skills: [{ title: "", items: [] }],
  experience: [
    { title: "", company: "", period: "", summary: "", points: [], tags: [] },
  ],
  projects: [{ name: "", url: "", blurb: "", stack: [] }],
  education: [{ degree: "", school: "", period: "" }],
  awards: [{ title: "", issuer: "", date: "" }],
  references: [{ name: "", title: "", phone: "" }],
  certification:
    "I hereby certify that the above information is true and correct to the best of my knowledge and ability.",
};

/** Printed links cannot be clicked, so the address itself is what is shown. */
export function plainUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Textarea of one item per line -> array, dropping blank lines. */
export function fromLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Comma or middot separated input -> array. */
export function fromList(value: string) {
  return value
    .split(/[,·]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
