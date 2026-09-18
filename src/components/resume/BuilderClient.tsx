"use client";

import dynamic from "next/dynamic";

/**
 * The builder only works in the browser — it reads a saved draft from
 * localStorage and photos through FileReader — so there is nothing worth
 * prerendering, and skipping SSR lets it read that draft during its first
 * render instead of after mount. `ssr: false` is only allowed from a Client
 * Component, which is all this wrapper is for.
 */
const ResumeBuilder = dynamic(
  () => import("@/components/resume/ResumeBuilder").then((mod) => mod.ResumeBuilder),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-ink px-4 py-8">
        <p className="text-sm text-muted">Loading builder…</p>
      </div>
    ),
  },
);

export function BuilderClient() {
  return <ResumeBuilder />;
}
