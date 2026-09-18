/**
 * SpeechSynthesisVoice carries no gender field, so a male voice can only be
 * found by name. Kept free of imports so it can be exercised on its own.
 */

/** Male English voices shipped by Windows, macOS, Chrome and Android. */
export const MALE_VOICES = [
  "andrew",
  "brian",
  "guy",
  "christopher",
  "eric",
  "roger",
  "steffan",
  "david",
  "mark",
  "alex",
  "daniel",
  "aaron",
  "reed",
  "rocko",
  "tom",
  "fred",
];

/** Anything that reads as a woman's voice, checked first — see below. */
const FEMALE_MARKERS = ["female", "woman", "zira", "hazel", "aria", "jenny", "michelle"];

type NamedVoice = { name: string; lang: string };

export function isMaleVoice(voice: NamedVoice) {
  const name = voice.name.toLowerCase();
  // "female" contains "male", so female has to be ruled out first or every
  // "Microsoft ... Female" voice matches as male.
  if (FEMALE_MARKERS.some((marker) => name.includes(marker))) return false;
  if (name.includes("male") || name.includes(" man")) return true;
  return MALE_VOICES.some((candidate) => name.includes(candidate));
}

/** Prefers a male English voice, and among those the better-sounding ones. */
export function pickVoice<T extends NamedVoice>(voices: T[]): T | null {
  const english = voices.filter((voice) => /^en\b|^en[-_]/i.test(voice.lang));
  if (english.length === 0) return null;

  const men = english.filter(isMaleVoice);
  const pool = men.length > 0 ? men : english;

  for (const hint of ["natural", "online", "google"]) {
    const better = pool.find((voice) => voice.name.toLowerCase().includes(hint));
    if (better) return better;
  }
  return pool.find((voice) => /^en[-_]us/i.test(voice.lang)) ?? pool[0];
}
