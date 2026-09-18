import { Section } from "@/components/Section";
import { profile, skillGroups } from "@/data/resume";

export function About() {
  return (
    <Section
      id="about"
      index="01"
      title="About"
      lead="Enterprise systems are where AI has to actually hold up. That is the work I do."
    >
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="space-y-5">
          {profile.summary.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="space-y-8">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-sm font-medium text-bone">{group.title}</h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {group.note}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-line bg-ink-2 px-2.5 py-1 text-xs text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
