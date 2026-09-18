import { experience, profile } from "@/data/resume";

/**
 * Written for the ear, not the page: no dashes, symbols or abbreviations that a
 * speech synthesiser would spell out. Kept separate from the on-page copy for
 * that reason, while still drawing the facts from the same profile.
 */
export const voiceIntro = [
  `Hi, welcome to my portfolio. I am ${profile.shortName}, an ${profile.role} and full stack developer based in ${profile.location}.`,
  "I build production AI features into enterprise systems, and the full stack web applications around them.",
  `I have been building software for over seven years. Since ${experience[0].start} I have been at ${experience[0].company}, working across PHP Laravel, React, Vue, Angular and Node, using AI augmented workflows in Claude Code and Cursor.`,
  "Day to day that means turning messy data into queryable systems, wiring CRM automation across HubSpot and Zapier, and getting AI features into live production alongside data teams.",
  "Scroll on for my selected work, or try the resume builder to make your own resume on this template. If you have something that needs building, get in touch.",
].join(" ");
