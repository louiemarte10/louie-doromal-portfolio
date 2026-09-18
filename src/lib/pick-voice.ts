/**
 * SpeechSynthesisVoice carries no gender and no accent control, so the voice can
 * only be chosen from what a machine happens to have installed, by name and
 * language tag. Kept free of imports so it can be exercised on its own.
 */

/** Male English voices shipped by Windows, macOS, Chrome and Android. */
export const MALE_VOICES = [
  "angelo", // Filipino, male
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
const FEMALE_MARKERS = [
  "female",
  "woman",
  "zira",
  "hazel",
  "aria",
  "jenny",
  "michelle",
  "blessica", // Filipino, female
];

/** Names that mark a neural voice — the ones that sound least synthetic. */
const NEURAL_MARKERS = ["natural", "neural", "online", "google"];

type NamedVoice = { name: string; lang: string };

const isEnglish = (voice: NamedVoice) => /^en\b|^en[-_]/i.test(voice.lang);
const isPhilippineEnglish = (voice: NamedVoice) => /^en[-_]ph/i.test(voice.lang);
const isFilipino = (voice: NamedVoice) => /^(fil|tl)\b|^(fil|tl)[-_]/i.test(voice.lang);
const isNeural = (voice: NamedVoice) =>
  NEURAL_MARKERS.some((marker) => voice.name.toLowerCase().includes(marker));

export function isMaleVoice(voice: NamedVoice) {
  const name = voice.name.toLowerCase();
  // "female" contains "male", so female has to be ruled out first or every
  // "Microsoft ... Female" voice matches as male.
  if (FEMALE_MARKERS.some((marker) => name.includes(marker))) return false;
  if (name.includes("male") || name.includes(" man")) return true;
  return MALE_VOICES.some((candidate) => name.includes(candidate));
}

/**
 * Ranked for a Filipino-American sounding narration, best first:
 *
 * 1. Philippine English — the accent actually being asked for.
 * 2. A neural Filipino voice. Legacy Tagalog voices mangle English badly, so
 *    only the neural ones are trusted this high.
 * 3. A neural English voice. American rather than Filipino, but by far the
 *    least robotic, which matters more than the accent.
 * 4. Any male English voice, then any English voice at all.
 */
export function pickVoice<T extends NamedVoice>(voices: T[]): T | null {
  const english = voices.filter(isEnglish);
  const filipino = voices.filter(isFilipino);

  const tiers: T[][] = [
    english.filter((v) => isPhilippineEnglish(v) && isMaleVoice(v)),
    english.filter(isPhilippineEnglish),
    filipino.filter((v) => isMaleVoice(v) && isNeural(v)),
    english.filter((v) => isMaleVoice(v) && isNeural(v)),
    english.filter(isNeural),
    english.filter(isMaleVoice),
    english,
  ];

  for (const tier of tiers) {
    if (tier.length > 0) {
      return tier.find((voice) => /^en[-_]us/i.test(voice.lang)) ?? tier[0];
    }
  }
  return null;
}
