"use client";

/**
 * Covers /resume and /resume/build. Without this, a client-side failure leaves
 * the browser's own "this page couldn't load" screen and no way back — which is
 * the likely outcome when a visitor navigates just after a deploy and the page
 * they are holding asks for a script chunk the new build has replaced.
 *
 * `reset` re-renders the route, which is enough for a transient fault. A stale
 * chunk reference needs the document itself fetched again, so that is offered
 * separately.
 */
export default function ResumeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6">
      <div className="w-full max-w-md text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
          Something broke
        </p>

        <h1 className="mt-4 text-2xl font-medium text-bone">
          This page did not load properly.
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          Usually a stale file left over from a recent update. Reloading fetches
          the current version.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-85"
          >
            Reload the page
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-line px-5 py-2.5 text-sm text-bone transition-colors hover:border-accent hover:text-accent"
          >
            Try again
          </button>
          {/* Deliberately a plain anchor, not next/link: a client-side
              navigation runs through the same broken runtime that landed the
              visitor here. This fetches the document afresh. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="rounded-full border border-line px-5 py-2.5 text-sm text-bone transition-colors hover:border-accent hover:text-accent"
          >
            Back to the portfolio
          </a>
        </div>

        {error.digest ? (
          <p className="mt-6 font-mono text-[10px] text-muted/60">
            Reference {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}
