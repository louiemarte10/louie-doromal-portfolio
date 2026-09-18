import { Section } from "@/components/Section";
import { projects, type Project } from "@/data/resume";

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  // The card as a whole points at the live site when there is one, and falls
  // back to the repository. No target means there is nothing to click.
  const target = project.live ?? project.href ?? null;
  // The repository is only worth its own link once the card itself is already
  // taking the visitor to the deployed site.
  const secondary = project.live && project.href ? project.href : null;

  return (
    <article
      className={`relative flex flex-col bg-ink-2 p-6 transition-colors ${
        target ? "group hover:bg-ink-3 focus-within:bg-ink-3" : ""
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {project.context}
      </p>

      <h3
        className={`mt-3 font-medium text-bone ${featured ? "text-lg" : "text-base"}`}
      >
        {target ? (
          <a
            href={target}
            target="_blank"
            rel="noreferrer"
            // The pseudo-element stretches this link's hit area over the whole
            // card, which keeps the other links out of it instead of nesting
            // them inside an anchor.
            className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
          >
            {project.name}
            <span
              aria-hidden
              className="ml-1.5 inline-block text-accent transition-transform group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </a>
        ) : (
          project.name
        )}
      </h3>

      <p
        className={`${featured ? "mt-3" : "mt-2.5"} text-sm leading-relaxed text-muted`}
      >
        {project.blurb}
      </p>

      {featured ? (
        <ul className="mt-5 space-y-2">
          {project.points.map((point) => (
            <li
              key={point.slice(0, 24)}
              className="flex gap-2.5 text-[13px] leading-relaxed text-bone/70"
            >
              <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className={featured ? "mt-auto pt-6" : "mt-4"}>
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

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {target ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-accent">
              {project.live ? "Visit live site" : "View repository"}
              <span aria-hidden>↗</span>
            </span>
          ) : null}

          {secondary ? (
            <a
              href={secondary}
              target="_blank"
              rel="noreferrer"
              // Sits above the card-wide overlay so it stays clickable on its own.
              className="relative z-10 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent"
            >
              Repository
              <span aria-hidden>↗</span>
            </a>
          ) : null}

          {!target && featured ? (
            <p className="text-xs text-muted">Private company repository</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <Section
      id="work"
      index="03"
      title="Selected work"
      lead="Systems I built."
    >
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <ProjectCard key={project.name} project={project} featured />
        ))}
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </Section>
  );
}
