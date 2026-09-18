import type { ReactNode } from "react";
import Image from "next/image";
import { plainUrl, type ResumeContent } from "@/lib/resume-content";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 border-b border-paper-rule pb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-paper-accent">
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * List markers are real glyphs rather than styled spans: a background-coloured
 * dot vanishes in print unless the visitor happens to tick background graphics
 * in the print dialog.
 */
function Points({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[11px] leading-[1.45] marker:text-paper-accent">
      {items.map((item) => (
        <li key={item.slice(0, 32)}>{item}</li>
      ))}
    </ul>
  );
}

function hasText(...values: string[]) {
  return values.some((value) => value.trim().length > 0);
}

export function ResumeSheet({ content }: { content: ResumeContent }) {
  const links = content.links.filter((link) => link.trim().length > 0);
  const paragraphs = content.profile.filter((entry) => entry.trim().length > 0);
  const skills = content.skills.filter(
    (group) => hasText(group.title) || group.items.length > 0,
  );
  const roles = content.experience.filter((role) => hasText(role.title, role.company));
  const works = content.projects.filter((project) => hasText(project.name));
  const schools = content.education.filter((entry) => hasText(entry.degree, entry.school));
  const honours = content.awards.filter((award) => hasText(award.title));
  const referees = content.references.filter((person) => hasText(person.name));

  return (
    <article className="resume-sheet mx-auto rounded-sm bg-paper text-paper-ink shadow-2xl shadow-black/40">
      <header className="flex items-start gap-5 border-b border-paper-rule pb-4">
        {content.photo ? (
          content.photo.startsWith("data:") ? (
            // A builder upload is a data URL, which the image optimiser cannot take.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.photo}
              alt={content.name || "Photo"}
              className="h-[112px] w-[84px] shrink-0 rounded-md object-cover"
            />
          ) : (
            <Image
              src={content.photo}
              alt={content.name || "Photo"}
              width={84}
              height={112}
              loading="eager"
              className="shrink-0 rounded-md object-cover"
            />
          )
        ) : null}

        <div className="min-w-0 flex-1">
          <h1 className="text-[25px] font-semibold leading-tight tracking-tight">
            {content.name || "Your name"}
          </h1>
          {hasText(content.role) ? (
            <p className="mt-0.5 text-[13px] font-medium text-paper-accent">
              {content.role}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[10.5px] text-paper-soft">
            {hasText(content.location) ? <span>{content.location}</span> : null}
            {hasText(content.email) ? (
              <a href={`mailto:${content.email}`}>{content.email}</a>
            ) : null}
            {hasText(content.phone) ? <span>{content.phone}</span> : null}
            {links.map((link) => (
              <a key={link} href={link}>
                {plainUrl(link)}
              </a>
            ))}
          </div>
        </div>
      </header>

      {paragraphs.length > 0 ? (
        <Block title="Profile">
          <div className="space-y-1.5 text-[11px] leading-[1.5] text-paper-soft">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </Block>
      ) : null}

      {skills.length > 0 ? (
        <Block title="Core competencies">
          <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {skills.map((group) => (
              <div key={group.title} className="avoid-break">
                <dt className="text-[11px] font-semibold">{group.title}</dt>
                <dd className="mt-0.5 text-[10.5px] leading-[1.45] text-paper-soft">
                  {group.items.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </Block>
      ) : null}

      {roles.length > 0 ? (
        <Block title="Experience">
          <div className="space-y-3.5">
            {roles.map((role) => (
              <div key={`${role.title}-${role.company}`} className="avoid-break">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-[12px] font-semibold">
                    {role.title}
                    {hasText(role.company) ? (
                      <span className="font-normal text-paper-soft">
                        {" · "}
                        {role.company}
                      </span>
                    ) : null}
                  </h3>
                  <p className="font-mono text-[9.5px] uppercase tracking-wide text-paper-soft">
                    {role.period}
                  </p>
                </div>
                {hasText(role.summary) ? (
                  <p className="mt-1 text-[10.5px] italic leading-snug text-paper-soft">
                    {role.summary}
                  </p>
                ) : null}
                <Points items={role.points} />
                {role.tags.length > 0 ? (
                  <p className="mt-1.5 font-mono text-[9.5px] text-paper-soft">
                    {role.tags.join(" · ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Block>
      ) : null}

      {works.length > 0 ? (
        <Block title="Selected projects">
          <div className="space-y-2.5">
            {works.map((project) => (
              <div key={project.name} className="avoid-break">
                <h3 className="flex flex-wrap items-baseline gap-x-2 text-[11.5px] font-semibold">
                  {project.name}
                  {hasText(project.url) ? (
                    <a
                      href={project.url}
                      className="font-mono text-[9.5px] font-normal text-paper-soft"
                    >
                      {plainUrl(project.url)}
                    </a>
                  ) : null}
                </h3>
                {hasText(project.blurb) ? (
                  <p className="mt-0.5 text-[10.5px] leading-[1.45] text-paper-soft">
                    {project.blurb}
                  </p>
                ) : null}
                {project.stack.length > 0 ? (
                  <p className="mt-0.5 font-mono text-[9.5px] text-paper-soft">
                    {project.stack.join(" · ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Block>
      ) : null}

      {schools.length > 0 || honours.length > 0 ? (
        <div className="grid gap-x-8 sm:grid-cols-2">
          {schools.length > 0 ? (
            <Block title="Education">
              <div className="space-y-2">
                {schools.map((entry) => (
                  <div key={`${entry.degree}-${entry.school}`} className="avoid-break">
                    <p className="text-[11px] font-semibold">{entry.degree}</p>
                    <p className="text-[10.5px] text-paper-soft">{entry.school}</p>
                    <p className="font-mono text-[9.5px] text-paper-soft">{entry.period}</p>
                  </div>
                ))}
              </div>
            </Block>
          ) : null}

          {honours.length > 0 ? (
            <Block title="Awards & certifications">
              <div className="space-y-2">
                {honours.map((award) => (
                  <div key={award.title} className="avoid-break">
                    <p className="text-[11px] font-semibold">{award.title}</p>
                    <p className="text-[10.5px] text-paper-soft">{award.issuer}</p>
                    <p className="font-mono text-[9.5px] text-paper-soft">{award.date}</p>
                  </div>
                ))}
              </div>
            </Block>
          ) : null}
        </div>
      ) : null}

      {referees.length > 0 ? (
        <Block title="Character references">
          <div className="grid gap-x-8 gap-y-2.5 sm:grid-cols-3">
            {referees.map((person) => (
              <div key={person.name} className="avoid-break">
                <p className="text-[11px] font-semibold">{person.name}</p>
                <p className="text-[10.5px] leading-snug text-paper-soft">{person.title}</p>
                <p className="mt-0.5 font-mono text-[10px] text-paper-soft">{person.phone}</p>
              </div>
            ))}
          </div>
        </Block>
      ) : null}

      {hasText(content.certification) ? (
        <div className="avoid-break mt-5">
          <p className="text-[10.5px] italic leading-snug text-paper-soft">
            {content.certification}
          </p>

          <div className="mt-6 flex justify-end">
            <div className="text-center">
              <p className="border-b border-paper-ink pb-0.5 text-[11px] font-semibold uppercase tracking-wide">
                {content.name || "Your name"}
              </p>
              <p className="mt-1 text-[10.5px] text-paper-soft">Applicant</p>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
