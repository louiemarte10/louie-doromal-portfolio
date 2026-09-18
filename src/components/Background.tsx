import { Section } from "@/components/Section";
import { awards, education } from "@/data/resume";

export function Background() {
  return (
    <Section id="background" index="05" title="Background">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h3 className="text-sm font-medium text-bone">Education</h3>
          <ul className="mt-5 space-y-6">
            {education.map((item) => (
              <li key={item.school} className="border-l border-line pl-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-sm text-bone">{item.degree}</p>
                  <span className="font-mono text-[11px] text-muted">{item.period}</span>
                </div>
                <p className="mt-1 text-sm text-accent">{item.school}</p>
                <p className="mt-0.5 text-xs text-muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-bone">Awards & certificates</h3>
          <ul className="mt-5 space-y-6">
            {awards.map((item) => (
              <li key={item.title} className="border-l border-line pl-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-sm text-bone">{item.title}</p>
                  <span className="font-mono text-[11px] text-muted">{item.date}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{item.issuer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
