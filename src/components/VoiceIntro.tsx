"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pickVoice } from "@/lib/pick-voice";
import { voiceIntro, voiceIntroWords } from "@/lib/voice-intro";

type State = "idle" | "speaking" | "unsupported";

/** Once per tab, so coming back from /resume does not restart the narration. */
const PLAYED_KEY = "voice-intro-played";

const RATE = 0.97;
/** Synthesised speech lands near 165 words a minute before the rate is applied. */
const TOTAL_SECONDS = Math.round((voiceIntroWords / (165 * RATE)) * 60);

function clock(seconds: number) {
  const whole = Math.max(0, Math.round(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function remember() {
  try {
    window.sessionStorage.setItem(PLAYED_KEY, "1");
  } catch {
    // Storage blocked; autoplay is simply attempted again on the next load.
  }
}

export function VoiceIntro() {
  const [state, setState] = useState<State>("idle");
  const [elapsed, setElapsed] = useState(0);
  /** From real word-boundary events where the browser sends them. */
  const [spokenChars, setSpokenChars] = useState(0);
  // Chrome can garbage-collect a speaking utterance and cut it off mid-sentence;
  // holding the reference keeps it alive until it finishes.
  const spoken = useRef<SpeechSynthesisUtterance | null>(null);
  const started = useRef(false);
  const silenced = useRef(false);

  const play = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      setState("unsupported");
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(voiceIntro);
    const voice = pickVoice(synth.getVoices());
    if (voice) utterance.voice = voice;
    utterance.rate = RATE;
    utterance.pitch = 0.95;
    utterance.onstart = () => {
      started.current = true;
      remember();
      setState("speaking");
    };
    utterance.onboundary = (event) => setSpokenChars(event.charIndex);
    utterance.onend = () => {
      setState("idle");
      setSpokenChars(0);
    };
    utterance.onerror = () => setState("idle");

    spoken.current = utterance;
    setElapsed(0);
    setSpokenChars(0);
    setState("speaking");
    synth.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    silenced.current = true; // A later click must not start it again.
    window.speechSynthesis.cancel();
    setState("idle");
    setElapsed(0);
    setSpokenChars(0);
  }, []);

  const speaking = state === "speaking";

  // The clock ticks itself; the callback keeps setState out of the effect body.
  useEffect(() => {
    if (!speaking) return;
    const id = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [speaking]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    try {
      if (window.sessionStorage.getItem(PLAYED_KEY)) return;
    } catch {
      // Storage blocked; fall through and try anyway.
    }

    /**
     * Tried on a timer and again on the visitor's first interaction, whichever
     * lands first. Browsers refuse audio until a page has been interacted with,
     * and they are inconsistent about reporting that refusal, so the interaction
     * is a fallback rather than something the timer's failure triggers. The
     * delay also lets the voice list populate, otherwise the first attempt gets
     * the default voice rather than a male one.
     */
    const attempt = () => {
      if (started.current || silenced.current) return;
      play();
    };

    const timer = window.setTimeout(attempt, 600);
    window.addEventListener("pointerdown", attempt);
    window.addEventListener("keydown", attempt);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", attempt);
      window.removeEventListener("keydown", attempt);
      window.speechSynthesis.cancel();
    };
  }, [play]);

  // Word boundaries are exact but not every browser sends them, so the clock
  // stands in when they are missing.
  const progress = spokenChars
    ? Math.min(1, spokenChars / voiceIntro.length)
    : Math.min(1, elapsed / TOTAL_SECONDS);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={speaking ? stop : play}
          aria-pressed={speaking}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-bone transition-colors hover:border-accent hover:text-accent"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-current">
            {speaking ? (
              <rect x="6" y="6" width="12" height="12" rx="1.5" />
            ) : (
              <path d="M8 5v14l11-7z" />
            )}
          </svg>
          {speaking ? "Stop the intro" : "Hear my intro"}
        </button>

        <p
          className="font-mono text-xs tabular-nums text-muted"
          aria-live="off"
          aria-label={
            speaking
              ? `${clock(elapsed)} of about ${clock(TOTAL_SECONDS)}`
              : `About ${clock(TOTAL_SECONDS)} long`
          }
        >
          {speaking ? clock(elapsed) : "0:00"}
          <span className="text-muted/50"> / {clock(TOTAL_SECONDS)}</span>
        </p>
      </div>

      <div
        className="mt-3 h-0.5 w-full max-w-xs overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label="Introduction progress"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {state === "unsupported" ? (
        <p className="mt-2 text-xs text-muted">
          This browser has no speech synthesis. Everything below is written out.
        </p>
      ) : null}
    </div>
  );
}
