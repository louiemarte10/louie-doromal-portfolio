"use client";

import { useEffect, useRef, useState } from "react";
import { voiceIntro } from "@/lib/voice-intro";

type State = "idle" | "speaking" | "unsupported";

/**
 * Narrates the introduction with the browser's own Web Speech API: free, needs
 * no key and sends nothing anywhere. It cannot start on its own — browsers only
 * allow audio after a real click, and unannounced speech would be hostile
 * anyway — so it is a button the visitor presses.
 */
export function VoiceIntro() {
  const [state, setState] = useState<State>("idle");
  // Chrome can garbage-collect a speaking utterance and cut it off mid-sentence;
  // holding the reference keeps it alive until it finishes.
  const spoken = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  /** Best available English voice, else whatever the browser defaults to. */
  function pickVoice(synth: SpeechSynthesis) {
    const english = synth.getVoices().filter((voice) => /^en\b|^en[-_]/i.test(voice.lang));
    if (english.length === 0) return null;
    const preferred = ["natural", "google", "online"];
    for (const hint of preferred) {
      const match = english.find((voice) => voice.name.toLowerCase().includes(hint));
      if (match) return match;
    }
    return english.find((voice) => /^en[-_]us/i.test(voice.lang)) ?? english[0];
  }

  function stop() {
    window.speechSynthesis.cancel();
    setState("idle");
  }

  function play() {
    if (!("speechSynthesis" in window)) {
      setState("unsupported");
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(voiceIntro);
    const voice = pickVoice(synth);
    if (voice) utterance.voice = voice;
    utterance.rate = 0.97;
    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");

    spoken.current = utterance;
    setState("speaking");
    synth.speak(utterance);
  }

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
