import { Section } from "@/components/Section";
import { experience } from "@/data/resume";

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      title="Experience"
      lead="Seven years across HR systems, university research, school platforms, and now enterprise AI."
    >
      <ol className="relative border-l border-line pl-6 sm:pl-10">
        {experience.map((role) => (
          <li key={`${role.company}-${role.start}`} className="pb-14 last:pb-0">
            <span
              aria-hidden
              className={`absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full border-2 border-ink ${
                role.current ? "bg-accent" : "bg-line"
              }`}
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-medium text-bone">{role.title}</h3>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                {role.period}
              </span>
            </div>

            <p className="mt-1 text-sm text-accent">{role.company}</p>
            <p className="mt-3 text-sm leading-relaxed text-bone/80">{role.summary}</p>

            <ul className="mt-4 space-y-2">
              {role.points.map((point) => (
                <li key={point.slice(0, 28)} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-line" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {role.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-line bg-ink-2 px-2 py-0.5 font-mono text-[10px] text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
