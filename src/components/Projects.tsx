import { Section } from "@/components/Section";
import { projects } from "@/data/resume";

export function Projects() {
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <Section
      id="work"
      index="03"
      title="Selected work"
      lead="Systems I built and still maintain — at work and on my own time."
    >
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <article key={project.name} className="flex flex-col bg-ink-2 p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {project.context}
            </p>

            <h3 className="mt-3 text-lg font-medium text-bone">{project.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{project.blurb}</p>

            <ul className="mt-5 space-y-2">
              {project.points.map((point) => (
                <li key={point.slice(0, 24)} className="flex gap-2.5 text-[13px] leading-relaxed text-bone/70">
                  <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-accent transition-opacity hover:opacity-75"
                >
                  View repository
                  <span aria-hidden>↗</span>
                </a>
              ) : (
                <p className="mt-4 text-xs text-muted">Private company repository</p>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        {rest.map((project) => (
          <article key={project.name} className="bg-ink-2 p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {project.context}
            </p>
            <h3 className="mt-3 text-base font-medium text-bone">{project.name}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">{project.blurb}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted"
                >
                  {item}
                </span>
              ))}
            </div>

            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-accent transition-opacity hover:opacity-75"
              >
                View repository
                <span aria-hidden>↗</span>
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}
