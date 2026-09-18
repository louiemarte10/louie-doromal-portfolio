"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pickVoice } from "@/lib/pick-voice";
import { voiceIntro, voiceIntroWords } from "@/lib/voice-intro";

type State = "idle" | "playing" | "paused" | "unsupported";

/** Once per tab, so coming back from /resume does not restart the narration. */
const PLAYED_KEY = "voice-intro-played";

/** A shade above natural pace: brisk without running away from the listener. */
const RATE = 1.05;
/** Synthesised speech lands near 165 words a minute before the rate is applied. */
const SPOKEN_SECONDS = Math.round((voiceIntroWords / (165 * RATE)) * 60);

function clock(seconds: number) {
  const whole = Math.max(0, Math.round(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/** Keeps an estimated resume point from starting mid-word. */
function snapToWord(index: number) {
  if (index <= 0) return 0;
  const next = voiceIntro.indexOf(" ", index);
  return next === -1 ? index : next + 1;
}

function remember() {
  try {
    window.sessionStorage.setItem(PLAYED_KEY, "1");
  } catch {
    // Storage blocked; autoplay is simply attempted again on the next load.
  }
}

export function VoiceIntro({ recordedSrc = null }: { recordedSrc?: string | null }) {
  const [state, setState] = useState<State>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [total, setTotal] = useState(recordedSrc ? 0 : SPOKEN_SECONDS);
  /** Absolute position in the script, from real word-boundary events. */
  const [spokenChars, setSpokenChars] = useState(0);

  const audio = useRef<HTMLAudioElement | null>(null);
  // Chrome can garbage-collect a speaking utterance and cut it off mid-sentence;
  // holding the reference keeps it alive until it finishes.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  /** Where a resume should pick the script back up. */
  const resumeChar = useRef(0);
  const started = useRef(false);
  const silenced = useRef(false);

  /**
   * Speaks from a character offset rather than calling resume(), because
   * speechSynthesis.pause() is unreliable for the network-backed voices this
   * picks first — it is quietly ignored, and the narration keeps going. Starting
   * a fresh utterance at the last word boundary resumes properly everywhere.
   */
  const speakFrom = useCallback((fromChar: number) => {
    const synth = window.speechSynthesis;

    // Detach the old utterance before cancelling, so its onend cannot land on
    // the new state.
    const previous = utteranceRef.current;
    if (previous) {
      previous.onend = null;
      previous.onerror = null;
      previous.onboundary = null;
      previous.onstart = null;
    }
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(voiceIntro.slice(fromChar));
    const voice = pickVoice(synth.getVoices());
    if (voice) utterance.voice = voice;
    utterance.rate = RATE;
    // Pitch left alone: bending an already male voice is one of the things that
    // makes a synthesiser sound like one.
    utterance.onstart = () => {
      started.current = true;
      remember();
      setState("playing");
    };
    utterance.onboundary = (event) => setSpokenChars(fromChar + event.charIndex);
    utterance.onend = () => {
      resumeChar.current = 0;
      setState("idle");
      setElapsed(0);
      setSpokenChars(0);
    };
    utterance.onerror = () => setState("idle");

    utteranceRef.current = utterance;
    setState("playing");
    synth.speak(utterance);
  }, []);

  const start = useCallback(() => {
    resumeChar.current = 0;
    setElapsed(0);
    setSpokenChars(0);

    if (recordedSrc) {
      const element = audio.current;
      if (!element) return;
      element.currentTime = 0;
      setState("playing");
      element.play().then(
        () => {
          started.current = true;
          remember();
        },
        () => setState("idle"), // Refused until the page has been interacted with.
      );
      return;
    }

    if (!("speechSynthesis" in window)) {
      setState("unsupported");
      return;
    }
    speakFrom(0);
  }, [recordedSrc, speakFrom]);

  /** Holds position: the clock and the bar stay where the listener stopped. */
  const pause = useCallback(() => {
    if (recordedSrc) {
      audio.current?.pause();
      setState("paused");
      return;
    }

    // Safari sends no boundary events, so fall back to where the clock says we
    // are rather than restarting the narration from the top.
    resumeChar.current =
      spokenChars > 0
        ? spokenChars
        : snapToWord(Math.floor((elapsed / SPOKEN_SECONDS) * voiceIntro.length));

    const current = utteranceRef.current;
    if (current) {
      current.onend = null;
      current.onerror = null;
      current.onboundary = null;
    }
    window.speechSynthesis.cancel();
    setState("paused");
  }, [recordedSrc, spokenChars, elapsed]);

  const resume = useCallback(() => {
    if (recordedSrc) {
      setState("playing");
      audio.current?.play().catch(() => setState("paused"));
      return;
    }
    speakFrom(resumeChar.current);
  }, [recordedSrc, speakFrom]);

  const playing = state === "playing";
  const paused = state === "paused";

  // A recording reports its own position, so this only drives synthesised
  // speech. The callback keeps setState out of the effect body.
  useEffect(() => {
    if (!playing || recordedSrc) return;
    const id = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [playing, recordedSrc]);

  useEffect(() => {
    if (!recordedSrc && !("speechSynthesis" in window)) return;

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
     * the default voice rather than the one chosen here.
     */
    const attempt = () => {
      if (started.current || silenced.current) return;
      start();
    };

    const timer = window.setTimeout(attempt, 600);
    window.addEventListener("pointerdown", attempt);
    window.addEventListener("keydown", attempt);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", attempt);
      window.removeEventListener("keydown", attempt);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [start, recordedSrc]);

  // Word boundaries are exact but not every browser sends them, so the clock
  // stands in when they are missing.
  const progress = recordedSrc
    ? total > 0
      ? Math.min(1, elapsed / total)
      : 0
    : spokenChars
      ? Math.min(1, spokenChars / voiceIntro.length)
      : Math.min(1, elapsed / SPOKEN_SECONDS);

  function onButton() {
    if (playing) {
      silenced.current = true; // Autoplay must not restart it behind them.
      pause();
    } else if (paused) {
      resume();
    } else {
      start();
    }
  }

  return (
    <div className="w-full max-w-xs">
      {recordedSrc ? (
        <audio
          ref={audio}
          src={recordedSrc}
          preload="metadata"
          onLoadedMetadata={(event) => setTotal(event.currentTarget.duration || 0)}
          onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
          onEnded={() => {
            setState("idle");
            setElapsed(0);
          }}
        />
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onButton}
          aria-label={playing ? "Pause the introduction" : "Play the introduction"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-bone transition-colors hover:border-accent hover:text-accent"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 fill-current">
            {playing ? (
              <>
                <rect x="7" y="5" width="3.5" height="14" rx="1" />
                <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
              </>
            ) : (
              <path d="M8 5v14l11-7z" />
            )}
          </svg>
        </button>

        <span className="text-sm text-bone">Intro</span>

        <span className="ml-auto font-mono text-xs tabular-nums text-muted">
          {clock(elapsed)}
          <span className="text-muted/50"> / {clock(total)}</span>
        </span>
      </div>

      <div
        className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-line"
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
