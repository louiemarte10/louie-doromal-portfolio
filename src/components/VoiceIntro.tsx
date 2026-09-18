"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pickVoice } from "@/lib/pick-voice";
import { voiceIntro } from "@/lib/voice-intro";

type State = "idle" | "speaking" | "unsupported";

/** Once per tab, so coming back from /resume does not restart the narration. */
const PLAYED_KEY = "voice-intro-played";

function remember() {
  try {
    window.sessionStorage.setItem(PLAYED_KEY, "1");
  } catch {
    // Storage blocked; autoplay is simply attempted again on the next load.
  }
}

export function VoiceIntro() {
  const [state, setState] = useState<State>("idle");
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
    utterance.rate = 0.97;
    utterance.pitch = 0.95;
    utterance.onstart = () => {
      started.current = true;
      remember();
      setState("speaking");
    };
    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");

    spoken.current = utterance;
    setState("speaking");
    synth.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    silenced.current = true; // A later click must not start it again.
    window.speechSynthesis.cancel();
    setState("idle");
  }, []);

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

  const speaking = state === "speaking";

  return (
    <div>
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

      {state === "unsupported" ? (
        <p className="mt-2 text-xs text-muted">
          This browser has no speech synthesis. Everything below is written out.
        </p>
      ) : null}
    </div>
  );
}
