"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pickVoice } from "@/lib/pick-voice";
import { voiceIntro, voiceIntroWords } from "@/lib/voice-intro";

type State = "idle" | "playing" | "paused" | "unsupported";

/** Once per tab, so coming back from /resume does not restart the narration. */
const PLAYED_KEY = "voice-intro-played";

/** A shade above natural pace: brisk without running away from the listener. */
const RATE = 1.05;
/**
 * Measured against this script rather than assumed: installed voices land near
 * 150 words a minute before the rate is applied. It is only an opening guess —
 * the real pace is whatever the listener's voice manages, so the total is
 * corrected from actual progress below.
 */
const BASE_WPM = 150;
const SPOKEN_SECONDS = Math.round((voiceIntroWords / (BASE_WPM * RATE)) * 60);

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
  /** Position being dragged, before it is committed. */
  const [scrub, setScrub] = useState<number | null>(null);

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

  /**
   * Jumps to a fraction of the way through. A recording can be seeked outright;
   * synthesised speech cannot, so the equivalent character offset is spoken
   * from instead, which is close enough given the rate barely varies.
   */
  const seek = useCallback(
    (fraction: number) => {
      const clamped = Math.min(1, Math.max(0, fraction));

      if (recordedSrc) {
        const element = audio.current;
        if (!element || !Number.isFinite(element.duration)) return;
        element.currentTime = clamped * element.duration;
        setElapsed(element.currentTime);
        // Seeking while paused holds the silence; from a standstill it starts.
        if (state === "idle") {
          setState("playing");
          void element.play().then(
            () => {
              started.current = true;
              remember();
            },
            () => setState("idle"),
          );
        }
        return;
      }

      const target = snapToWord(Math.floor(clamped * voiceIntro.length));
      resumeChar.current = target;
      setSpokenChars(target);
      setElapsed(Math.round(clamped * SPOKEN_SECONDS));

      // Dragging while paused moves the position without breaking the silence.
      if (state === "paused") return;
      if ("speechSynthesis" in window) speakFrom(target);
    },
    [recordedSrc, state, speakFrom],
  );

  const playing = state === "playing";
  const paused = state === "paused";

  // A recording reports its own position, so this only drives synthesised
  // speech. The callback keeps setState out of the effect body.
  useEffect(() => {
    if (!playing || recordedSrc) return;
    const id = window.setInterval(() => setElapsed((value) => value + 0.25), 250);
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

  // Word boundaries give the true position in the script. Where a browser sends
  // none, the clock stands in, held below the end so the bar cannot sit full
  // while the narration is still going.
  const progress = recordedSrc
    ? total > 0
      ? Math.min(1, elapsed / total)
      : 0
    : spokenChars
      ? Math.min(1, spokenChars / voiceIntro.length)
      : Math.min(0.97, elapsed / SPOKEN_SECONDS);

  // While dragging, the bar follows the pointer rather than the narration.
  const shown = scrub ?? progress;

  /**
   * A recording knows its own length. Synthesised speech does not, and the
   * opening guess was what let the clock run past the total, so once there is
   * enough progress to divide by, the total is derived from the real pace
   * instead. By construction that can never be less than the time elapsed.
   */
  const duration = recordedSrc
    ? total
    : progress > 0.08
      ? elapsed / progress
      : SPOKEN_SECONDS;

  function commitScrub() {
    if (scrub === null) return;
    seek(scrub);
    setScrub(null);
  }

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
          {clock(scrub === null ? elapsed : scrub * duration)}
          {/* Only a recording has a duration worth stating; for synthesised
              speech it would be a guess that visibly disagrees with the bar. */}
          {recordedSrc && total > 0 ? (
            <span className="text-muted/50"> / {clock(total)}</span>
          ) : null}
        </span>
      </div>

      <div className="group relative mt-1.5 h-4 w-full">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-line">
          <div
            className={`h-full rounded-full bg-accent ${
              scrub === null ? "transition-[width] duration-300 ease-linear" : ""
            }`}
            style={{ width: `${shown * 100}%` }}
          />
        </div>

        <div
          aria-hidden
          className={`pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 transition-opacity group-hover:opacity-100 ${
            scrub === null ? "" : "opacity-100"
          }`}
          style={{ left: `${shown * 100}%` }}
        />

        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          value={Math.round(shown * 1000)}
          onChange={(event) => setScrub(Number(event.target.value) / 1000)}
          onPointerUp={commitScrub}
          onKeyUp={commitScrub}
          onBlur={commitScrub}
          aria-label="Seek through the introduction"
          aria-valuetext={`${Math.round(shown * 100)} percent`}
          className="scrub absolute inset-0 h-full w-full"
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
