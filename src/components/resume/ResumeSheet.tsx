import type { ReactNode } from "react";
import Image from "next/image";
import { plainUrl, type ResumeContent } from "@/lib/resume-content";
import {
  defaultSurface,
  defaultTemplate,
  type SurfaceId,
  type Template,
} from "@/lib/resume-templates";

/**
 * Tolerates undefined on purpose. The sheet renders drafts restored from a
 * visitor's own storage, which can predate any field added since it was saved,
 * and a missing field must not take the whole page down.
 */
function hasText(...values: (string | null | undefined)[]) {
  return values.some((value) => typeof value === "string" && value.trim().length > 0);
}

/** Drops blanks, and anything that is not a string at all. */
function filled(values: (string | null | undefined)[] | null | undefined) {
  if (!Array.isArray(values)) return [];
  return values.filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );
}

function Block({
  t,
  title,
  children,
}: {
  t: Template;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={t.section}>
      <h2 className={t.heading}>{title}</h2>
      {children}
    </section>
  );
}

/** Bullets are real list markers: a background-coloured dot does not print. */
function Points({ items, t }: { items: string[]; t: Template }) {
  if (items.length === 0) return null;
  return (
    <ul
      className={`mt-1.5 list-disc space-y-1 pl-4 leading-[1.45] ${t.body} ${t.marker}`}
    >
      {items.map((item) => (
        <li key={item.slice(0, 32)}>{item}</li>
      ))}
    </ul>
  );
}

export function ResumeSheet({
  content,
  template = defaultTemplate,
  surface = defaultSurface.id,
}: {
  content: ResumeContent;
  template?: Template;
  surface?: SurfaceId;
}) {
  const t = template;

  const links = filled(content.links);
  const paragraphs = filled(content.profile);
  const list = <T,>(value: T[] | null | undefined) => (Array.isArray(value) ? value : []);

  const skills = list(content.skills).filter(
    (group) => hasText(group.title) || filled(group.items).length > 0,
  );
  const roles = list(content.experience).filter((role) => hasText(role.title, role.company));
  const works = list(content.projects).filter((project) => hasText(project.name));
  const schools = list(content.education).filter((entry) =>
    hasText(entry.degree, entry.school),
  );
  const honours = list(content.awards).filter((award) => hasText(award.title));
  const referees = list(content.references).filter((person) => hasText(person.name));

  const photo = content.photo ? (
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
  ) : null;

  const contacts = (
    <>
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
    </>
  );

  const name = content.name || "Your name";

  const header =
    t.header === "centered" ? (
      <header className="flex flex-col items-center border-b border-paper-ink/25 pb-4 text-center">
        {photo ? <div className="mb-3">{photo}</div> : null}
        <h1 className={t.name}>{name}</h1>
        {hasText(content.role) ? <p className={t.role}>{content.role}</p> : null}
        <div
          className={`mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-paper-soft ${t.small}`}
        >
          {contacts}
        </div>
      </header>
    ) : t.header === "banner" ? (
      <header>
        <div className="-mx-[14mm] flex items-center gap-5 bg-paper-ink px-[14mm] py-5 text-paper">
          {photo}
          <div className="min-w-0 flex-1">
            <h1 className={t.name}>{name}</h1>
            {hasText(content.role) ? <p className={t.role}>{content.role}</p> : null}
          </div>
        </div>
        <div
          className={`mt-3 flex flex-wrap gap-x-4 gap-y-0.5 border-b border-paper-rule pb-3 text-paper-soft ${t.small}`}
        >
          {contacts}
        </div>
      </header>
    ) : (
      <header className="flex items-start gap-5 border-b border-paper-rule pb-4">
        {photo}
        <div className="min-w-0 flex-1">
          <h1 className={t.name}>{name}</h1>
          {hasText(content.role) ? <p className={t.role}>{content.role}</p> : null}
          <div
            className={`mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-paper-soft ${t.small}`}
          >
            {contacts}
          </div>
        </div>
      </header>
    );

  const profileBlock =
    paragraphs.length > 0 ? (
      <Block t={t} title="Profile">
        <div className={`space-y-1.5 leading-[1.5] text-paper-soft ${t.body}`}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </Block>
    ) : null;

  const skillsBlock =
    skills.length > 0 ? (
      <Block t={t} title="Core competencies">
        <dl
          className={
            t.layout === "sidebar" ? "space-y-2" : "grid gap-x-8 gap-y-2 sm:grid-cols-2"
          }
        >
          {skills.map((group) => (
            <div key={group.title} className="avoid-break">
              <dt className={`font-semibold ${t.body}`}>{group.title}</dt>
              <dd className={`mt-0.5 leading-[1.45] text-paper-soft ${t.small}`}>
                {filled(group.items).join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
      </Block>
    ) : null;

  const experienceBlock =
    roles.length > 0 ? (
      <Block t={t} title="Experience">
        <div className={t.entries}>
          {roles.map((role) => (
            <div key={`${role.title}-${role.company}`} className="avoid-break">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className={`font-semibold ${t.body}`}>
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
                <p className={`mt-1 italic leading-snug text-paper-soft ${t.small}`}>
                  {role.summary}
                </p>
              ) : null}
              <Points items={filled(role.points)} t={t} />
              {filled(role.tags).length > 0 ? (
                <p className="mt-1.5 font-mono text-[9.5px] text-paper-soft">
                  {filled(role.tags).join(" · ")}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Block>
    ) : null;

  const projectsBlock =
    works.length > 0 ? (
      <Block t={t} title="Selected projects">
        <div className="space-y-2.5">
          {works.map((project) => (
            <div key={project.name} className="avoid-break">
              <h3
                className={`flex flex-wrap items-baseline gap-x-2 font-semibold ${t.body}`}
              >
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
              {hasText(project.context) ? (
                <p className={`mt-0.5 italic text-paper-soft ${t.small}`}>
                  {project.context}
                </p>
              ) : null}
              {hasText(project.blurb) ? (
                <p className={`mt-0.5 leading-[1.45] text-paper-soft ${t.small}`}>
                  {project.blurb}
                </p>
              ) : null}
              {filled(project.stack).length > 0 ? (
                <p className="mt-0.5 font-mono text-[9.5px] text-paper-soft">
                  {filled(project.stack).join(" · ")}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Block>
    ) : null;

  const educationBlock =
    schools.length > 0 ? (
      <Block t={t} title="Education">
        <div className="space-y-2">
          {schools.map((entry) => (
            <div key={`${entry.degree}-${entry.school}`} className="avoid-break">
              <p className={`font-semibold ${t.body}`}>{entry.degree}</p>
              <p className={`text-paper-soft ${t.small}`}>{entry.school}</p>
              <p className="font-mono text-[9.5px] text-paper-soft">{entry.period}</p>
            </div>
          ))}
        </div>
      </Block>
    ) : null;

  const awardsBlock =
    honours.length > 0 ? (
      <Block t={t} title="Awards & certifications">
        <div className="space-y-2">
          {honours.map((award) => (
            <div key={award.title} className="avoid-break">
              <p className={`font-semibold ${t.body}`}>{award.title}</p>
              <p className={`text-paper-soft ${t.small}`}>{award.issuer}</p>
              <p className="font-mono text-[9.5px] text-paper-soft">{award.date}</p>
            </div>
          ))}
        </div>
      </Block>
    ) : null;

  const referencesBlock =
    referees.length > 0 ? (
      <Block t={t} title="Character references">
        <div
          className={
            t.layout === "sidebar"
              ? "space-y-2"
              : "grid gap-x-8 gap-y-2.5 sm:grid-cols-3"
          }
        >
          {referees.map((person) => (
            <div key={person.name} className="avoid-break">
              <p className={`font-semibold ${t.body}`}>{person.name}</p>
              <p className={`leading-snug text-paper-soft ${t.small}`}>{person.title}</p>
              <p className="mt-0.5 font-mono text-[10px] text-paper-soft">
                {person.phone}
              </p>
            </div>
          ))}
        </div>
      </Block>
    ) : null;

  const signature = hasText(content.certification) ? (
    <div className="avoid-break mt-5">
      <p className={`italic leading-snug text-paper-soft ${t.small}`}>
        {content.certification}
      </p>
      <div className="mt-6 flex justify-end">
        <div className="text-center">
          <p
            className={`border-b border-paper-ink pb-0.5 font-semibold uppercase tracking-wide ${t.body}`}
          >
            {name}
          </p>
          <p className={`mt-1 text-paper-soft ${t.small}`}>Applicant</p>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <article
      data-surface={surface}
      className={`resume-sheet mx-auto rounded-sm bg-paper text-paper-ink shadow-2xl shadow-black/40 ${t.font}`}
    >
      {header}

      {t.layout === "sidebar" ? (
        <div className="mt-1 grid gap-x-7 sm:grid-cols-[33%_minmax(0,1fr)]">
          <div className="sm:border-r sm:border-paper-rule sm:pr-7">
            {skillsBlock}
            {educationBlock}
            {awardsBlock}
            {referencesBlock}
          </div>
          <div>
            {profileBlock}
            {experienceBlock}
            {projectsBlock}
          </div>
        </div>
      ) : (
        <>
          {profileBlock}
          {skillsBlock}
          {experienceBlock}
          {projectsBlock}
          {schools.length > 0 || honours.length > 0 ? (
            <div className="grid gap-x-8 sm:grid-cols-2">
              {educationBlock}
              {awardsBlock}
            </div>
          ) : null}
          {referencesBlock}
        </>
      )}

      {signature}
    </article>
  );
}
