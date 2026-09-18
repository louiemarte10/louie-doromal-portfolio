"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  email: string;
  label: string;
  className: string;
  copiedLabel?: string;
};

/**
 * `mailto:` silently does nothing when the visitor has no mail client registered,
 * so the click also copies the address and says so. The href is kept intact for
 * everyone who does have a handler.
 */
export function EmailLink({ email, label, className, copiedLabel = "Copied ✓" }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard unavailable (insecure context or denied permission) — the
      // mailto navigation still goes ahead on its own.
    }
  }

  return (
    <a
      href={`mailto:${email}`}
      onClick={copyAddress}
      title={`${email} — click to copy, or open your mail app`}
      className={className}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </a>
  );
}
