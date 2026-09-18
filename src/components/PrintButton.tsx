"use client";

/**
 * Secondary to the committed PDF: prints whatever the page currently says, so
 * it stays right even if the PDF has not been regenerated after a data edit.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-line px-4 py-2 text-sm text-bone transition-colors hover:border-accent hover:text-accent"
    >
      Print
    </button>
  );
}
