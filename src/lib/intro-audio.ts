import { existsSync } from "node:fs";
import { join } from "node:path";

/** Checked in order; the first one present wins. */
const CANDIDATES = ["intro.mp3", "intro.m4a", "intro.ogg", "intro.wav"];

/**
 * No synthesiser passes for a real person, and none can blend two accents. So
 * if a recording is sitting in `public/`, it is played instead of the browser
 * voice — drop in `public/intro.mp3` and it takes over on the next build, with
 * no code change.
 *
 * Server-only: this runs in a Server Component while the page is being built.
 */
export function findRecordedIntro(): string | null {
  for (const name of CANDIDATES) {
    if (existsSync(join(process.cwd(), "public", name))) return `/${name}`;
  }
  return null;
}
