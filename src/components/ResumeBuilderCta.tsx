import Link from "next/link";
import { Section } from "@/components/Section";
import { templates } from "@/lib/resume-templates";

/**
 * The public entry point to the builder, anchored at #resume-builder so it can
 * be linked on its own — separate from my own resume.
 */
export function ResumeBuilderCta() {
  return (
    <Section
      id="resume-builder"
      index="06"
      title="Resume builder"
      lead="Build your own resume on the template I use."
    >
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="bg-ink-2 p-6">
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            Fill in a form and the A4 sheet updates beside it as you type, then print
            it to PDF. Your draft is kept in your own browser — nothing is uploaded
            and no account is needed.
          </p>

          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {templates.map((template) => (
              <li key={template.id}>
                <p className="text-[13px] text-bone">{template.label}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted">{template.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-6 bg-ink-2 p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Templates
            </p>
            <p className="mt-1 font-mono text-3xl text-bone">{templates.length}</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/resume/build"
              className="block rounded-full bg-accent px-5 py-2.5 text-center text-sm font-medium text-ink transition-opacity hover:opacity-85"
            >
              Open the builder
            </Link>
            <Link
              href="/resume"
              className="block text-center text-xs text-muted transition-colors hover:text-accent"
            >
              Or view my resume
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
