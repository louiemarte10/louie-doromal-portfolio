import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  index: string;
  title: string;
  lead?: string;
  children: ReactNode;
};

export function Section({ id, index, title, lead, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line/70 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mb-12 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
            {index} — {title}
          </p>
          {lead ? (
            <h2 className="mt-4 max-w-2xl text-2xl font-medium leading-snug text-bone sm:text-3xl">
              {lead}
            </h2>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
