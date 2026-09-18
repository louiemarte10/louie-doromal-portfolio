import { experience, profile, projects } from "@/data/resume";

/**
 * Punctuation a synthesiser would read out loud, or stumble over, turned into
 * something it can speak. Dashes become pauses rather than the word "dash".
 */
function forSpeech(text: string) {
  return text
    .replace(/[—–]/g, ",")
    .replace(/\s*·\s*/g, ", ")
    .replace(/(\d),(\d{3})/g, "$1$2")
    .replace(/(\d+)\+/g, "over $1")
    // A spaced dash leaves " ," behind once replaced.
    .replace(/\s+([,.])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Project names are written for the eye: "louieDevAgent" and "(MTD)" both come
 * out as noise, so the camel case is split and bracketed initials dropped.
 */
function spokenName(name: string) {
  const spaced = forSpeech(
    name
      .replace(/\(([A-Z]{2,})\)\s*/g, "")
      .replace(/([a-z])([A-Z])/g, "$1 $2"),
  );
  // Splitting "louieDevAgent" leaves a lower-case first word.
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** "React, Ant Design and Tailwind" rather than a comma-separated list. */
function spokenList(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const opening = [
  `Hi, welcome to my portfolio. I am ${profile.shortName}, an ${profile.role} and full stack developer based in ${profile.location}.`,
  "I build production AI features into enterprise systems, and the full stack web applications around them.",
  `I have been building software for over seven years. Since ${experience[0].start} I have been at ${experience[0].company}, working across PHP Laravel, React, Vue, Angular and Node, using AI augmented workflows in Claude Code and Cursor.`,
  "Day to day that means turning messy data into queryable systems, wiring CRM automation across HubSpot and Zapier, and getting AI features into live production alongside data teams.",
];

const featured = projects.filter((project) => project.featured);

/** So the narration does not say "first" four times over. */
function connector(index: number, total: number) {
  if (index === 0) return "First,";
  if (index === total - 1) return "And finally,";
  return "Next,";
}

const work = [
  "Let me walk you through the work I am most proud of.",
  ...featured.map((project, index) => {
    const stack = project.stack.slice(0, 3);
    const built = stack.length > 0 ? ` It is built with ${spokenList(stack)}.` : "";
    return `${connector(index, featured.length)} ${spokenName(project.name)}. ${forSpeech(project.blurb)}${built}`;
  }),
];

const closing = [
  "There is more on the page below, including a resume builder you can use to make your own resume on this template.",
  "If you have any questions, please feel free to email me, or reach out through any of the links here. I would be glad to hear from you.",
  "And always remember: just keep moving forward. Progress beats perfection every single time.",
  "Start small, stay consistent, and let the work compound. The best time to begin was yesterday, and the next best time is right now.",
  "Thanks for stopping by.",
];

export const voiceIntro = [...opening, ...work, ...closing].join(" ");

/** Used to show the listener how long the narration runs before they start it. */
export const voiceIntroWords = voiceIntro.split(/\s+/).filter(Boolean).length;
