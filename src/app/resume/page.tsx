import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import {
  awards,
  education,
  experience,
  profile,
  projects,
  skillGroups,
} from "@/data/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}, ${profile.role} in ${profile.location}.`,
};

/** Printed links cannot be clicked, so show the address itself. */
function plainUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

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

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2 text-[11px] leading-[1.45]">
      <span
        aria-hidden
        className="mt-[5px] h-[3px] w-[3px] shrink-0 rounded-full bg-paper-accent"
      />
      <span>{children}</span>
    </li>
  );
}

export default function ResumePage() {
  const selected = projects.filter((project) => project.featured);

  return (
    <div className="min-h-screen bg-ink py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-5 flex w-full max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 print:hidden">
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-bone"
        >
          ← Back to portfolio
        </Link>
        <div className="flex items-center gap-2.5">
          <PrintButton />
          <a
            href="/louie-doromal-resume.pdf"
            download
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-85"
          >
            Download PDF
          </a>
        </div>
      </div>

      <article className="resume-sheet mx-auto rounded-sm bg-paper text-paper-ink shadow-2xl shadow-black/40">
        <header className="flex items-start gap-5 border-b border-paper-rule pb-4">
          <Image
            src="/lou.png"
            alt={profile.name}
            width={84}
            height={112}
            loading="eager"
            className="shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-[25px] font-semibold leading-tight tracking-tight">
              {profile.name}
            </h1>
            <p className="mt-0.5 text-[13px] font-medium text-paper-accent">
              {profile.role}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[10.5px] text-paper-soft">
              <span>{profile.location}</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>{profile.phone}</span>
              <a href={profile.github}>{plainUrl(profile.github)}</a>
              <a href={profile.linkedin}>{plainUrl(profile.linkedin)}</a>
            </div>
          </div>
        </header>

        <Block title="Profile">
          <div className="space-y-1.5 text-[11px] leading-[1.5] text-paper-soft">
            {profile.summary.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Block>

        <Block title="Core competencies">
          <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.title} className="avoid-break">
                <dt className="text-[11px] font-semibold">{group.title}</dt>
                <dd className="mt-0.5 text-[10.5px] leading-[1.45] text-paper-soft">
                  {group.items.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="Experience">
          <div className="space-y-3.5">
            {experience.map((role) => (
              <div key={`${role.company}-${role.period}`} className="avoid-break">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-[12px] font-semibold">
                    {role.title}
                    <span className="font-normal text-paper-soft">
                      {" · "}
                      {role.company}
                    </span>
                  </h3>
                  <p className="font-mono text-[9.5px] uppercase tracking-wide text-paper-soft">
                    {role.period}
                  </p>
                </div>
                <p className="mt-1 text-[10.5px] italic leading-snug text-paper-soft">
                  {role.summary}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {role.points.map((point) => (
                    <Bullet key={point.slice(0, 24)}>{point}</Bullet>
                  ))}
                </ul>
                <p className="mt-1.5 font-mono text-[9.5px] text-paper-soft">
                  {role.tags.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Selected projects">
          <div className="space-y-2.5">
            {selected.map((project) => {
              const url = project.live ?? project.href;
              return (
                <div key={project.name} className="avoid-break">
                  <h3 className="flex flex-wrap items-baseline gap-x-2 text-[11.5px] font-semibold">
                    {project.name}
                    {url ? (
                      <a
                        href={url}
                        className="font-mono text-[9.5px] font-normal text-paper-soft"
                      >
                        {plainUrl(url)}
                      </a>
                    ) : null}
                  </h3>
                  <p className="mt-0.5 text-[10.5px] leading-[1.45] text-paper-soft">
                    {project.blurb}
                  </p>
                  <p className="mt-0.5 font-mono text-[9.5px] text-paper-soft">
                    {project.stack.join(" · ")}
                  </p>
                </div>
              );
            })}
          </div>
        </Block>

        <div className="grid gap-x-8 sm:grid-cols-2">
          <Block title="Education">
            <div className="space-y-2">
              {education.map((entry) => (
                <div key={entry.school} className="avoid-break">
                  <p className="text-[11px] font-semibold">{entry.degree}</p>
                  <p className="text-[10.5px] text-paper-soft">{entry.school}</p>
                  <p className="font-mono text-[9.5px] text-paper-soft">
                    {entry.period}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Awards & certifications">
            <div className="space-y-2">
              {awards.map((award) => (
                <div key={award.title} className="avoid-break">
                  <p className="text-[11px] font-semibold">{award.title}</p>
                  <p className="text-[10.5px] text-paper-soft">{award.issuer}</p>
                  <p className="font-mono text-[9.5px] text-paper-soft">{award.date}</p>
                </div>
              ))}
            </div>
          </Block>
        </div>
      </article>
    </div>
  );
}
