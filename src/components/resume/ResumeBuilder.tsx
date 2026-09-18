"use client";

import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import Link from "next/link";
import { ResumeSheet } from "@/components/resume/ResumeSheet";
import {
  blankContent,
  fromLines,
  fromList,
  ownerContent,
  type ResumeContent,
} from "@/lib/resume-content";
import {
  defaultSurface,
  defaultTemplate,
  surfaceById,
  surfaces,
  templateById,
  templates,
  type SurfaceId,
  type TemplateId,
} from "@/lib/resume-templates";

const STORAGE_KEY = "resume-builder-v1";
const TEMPLATE_KEY = "resume-builder-template-v1";
const SURFACE_KEY = "resume-builder-surface-v1";

/** Only ever a convenience: the draft is per-browser and never leaves it. */
function loadDraft(): ResumeContent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ResumeContent>;
    return { ...blankContent, ...parsed };
  } catch {
    return null;
  }
}

function saveDraft(content: ResumeContent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    // Quota exceeded (a large photo) or storage blocked: the session still works.
  }
}

function loadTemplateId(): TemplateId {
  try {
    return templateById(window.localStorage.getItem(TEMPLATE_KEY)).id;
  } catch {
    return defaultTemplate.id;
  }
}

function saveTemplateId(id: TemplateId) {
  try {
    window.localStorage.setItem(TEMPLATE_KEY, id);
  } catch {
    // Storage blocked; the choice still applies for this session.
  }
}

function loadSurfaceId(): SurfaceId {
  try {
    return surfaceById(window.localStorage.getItem(SURFACE_KEY)).id;
  } catch {
    return defaultSurface.id;
  }
}

function saveSurfaceId(id: SurfaceId) {
  try {
    window.localStorage.setItem(SURFACE_KEY, id);
  } catch {
    // Storage blocked; the choice still applies for this session.
  }
}

const field =
  "w-full rounded-md border border-line bg-ink-3 px-2.5 py-1.5 text-sm text-bone outline-none placeholder:text-muted/60 focus:border-accent";
const label = "block text-[11px] font-medium uppercase tracking-wide text-muted";
const minorButton =
  "rounded-md border border-line px-2 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent";

function Field({
  title,
  value,
  onChange,
  placeholder,
  rows,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block space-y-1">
      <span className={label}>{title}</span>
      {rows ? (
        <textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`${field} resize-y leading-relaxed`}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={field}
        />
      )}
    </label>
  );
}

function Fieldset({
  title,
  children,
  onAdd,
}: {
  title: string;
  children: ReactNode;
  onAdd?: () => void;
}) {
  return (
    <section className="border-t border-line/70 pt-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          {title}
        </h2>
        {onAdd ? (
          <button type="button" onClick={onAdd} className={minorButton}>
            + Add
          </button>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ onRemove, children }: { onRemove: () => void; children: ReactNode }) {
  return (
    <div className="space-y-2 rounded-lg border border-line/70 bg-ink-2 p-3">
      {children}
      <button type="button" onClick={onRemove} className={`${minorButton} w-full`}>
        Remove
      </button>
    </div>
  );
}

export function ResumeBuilder() {
  // Safe to read storage during the first render: this component is loaded with
  // `ssr: false`, so there is no server HTML for it to disagree with.
  const [content, setContent] = useState<ResumeContent>(
    () => loadDraft() ?? blankContent,
  );
  const [templateId, setTemplateId] = useState<TemplateId>(loadTemplateId);
  const [surfaceId, setSurfaceId] = useState<SurfaceId>(loadSurfaceId);
  const template = templateById(templateId);

  useEffect(() => {
    saveDraft(content);
  }, [content]);

  useEffect(() => {
    saveTemplateId(templateId);
  }, [templateId]);

  useEffect(() => {
    saveSurfaceId(surfaceId);
  }, [surfaceId]);

  function patch(changes: Partial<ResumeContent>) {
    setContent((current) => ({ ...current, ...changes }));
  }

  function update<K extends keyof ResumeContent>(
    key: K,
    index: number,
    changes: Partial<ResumeContent[K] extends (infer Item)[] ? Item : never>,
  ) {
    setContent((current) => {
      const list = [...(current[key] as unknown[])];
      list[index] = { ...(list[index] as object), ...changes };
      return { ...current, [key]: list } as ResumeContent;
    });
  }

  function add<K extends keyof ResumeContent>(key: K, blank: unknown) {
    setContent((current) => ({
      ...current,
      [key]: [...(current[key] as unknown[]), blank],
    }));
  }

  function remove<K extends keyof ResumeContent>(key: K, index: number) {
    setContent((current) => ({
      ...current,
      [key]: (current[key] as unknown[]).filter((_, i) => i !== index),
    }));
  }

  function onPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ photo: String(reader.result) });
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-ink py-8 print:bg-white print:py-0">
      <div className="mx-auto w-full max-w-[1400px] px-4 print:max-w-none print:px-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <h1 className="text-lg font-medium text-bone">Build your resume</h1>
            <p className="mt-0.5 text-xs text-muted">
              Five templates, printed at A4. Your draft stays in this browser —
              nothing is uploaded.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/resume" className={minorButton}>
              ← My resume
            </Link>
            <button
              type="button"
              onClick={() => setContent(ownerContent)}
              className={minorButton}
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={() => setContent(blankContent)}
              className={minorButton}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-85"
            >
              Save as PDF
            </button>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)] print:block">
          <form
            className="space-y-5 print:hidden"
            onSubmit={(event) => event.preventDefault()}
          >
            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Template
              </h2>
              <div className="space-y-1.5">
                {templates.map((option) => {
                  const active = option.id === templateId;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setTemplateId(option.id)}
                      className={`block w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                        active
                          ? "border-accent bg-ink-3"
                          : "border-line/70 bg-ink-2 hover:border-line"
                      }`}
                    >
                      <span
                        className={`block text-sm ${active ? "text-accent" : "text-bone"}`}
                      >
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                        {option.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                Background
              </h2>
              <div className="grid grid-cols-2 gap-1.5">
                {surfaces.map((option) => {
                  const active = option.id === surfaceId;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSurfaceId(option.id)}
                      className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                        active
                          ? "border-accent bg-ink-3"
                          : "border-line/70 bg-ink-2 hover:border-line"
                      }`}
                    >
                      <span
                        className={`block text-sm ${active ? "text-accent" : "text-bone"}`}
                      >
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                        {option.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <Fieldset title="Basics">
              <Field
                title="Full name"
                value={content.name}
                onChange={(name) => patch({ name })}
                placeholder="Juan D. Santos"
              />
              <Field
                title="Role"
                value={content.role}
                onChange={(role) => patch({ role })}
                placeholder="Software Engineer"
              />
              <Field
                title="Location"
                value={content.location}
                onChange={(location) => patch({ location })}
                placeholder="Iloilo City, Philippines"
              />
              <Field
                title="Email"
                value={content.email}
                onChange={(email) => patch({ email })}
                placeholder="you@example.com"
              />
              <Field
                title="Phone"
                value={content.phone}
                onChange={(phone) => patch({ phone })}
                placeholder="0900 000 0000"
              />
              <Field
                title="Links (one per line)"
                rows={2}
                value={content.links.join("\n")}
                onChange={(value) => patch({ links: fromLines(value) })}
                placeholder={"https://github.com/you\nhttps://linkedin.com/in/you"}
              />
              <label className="block space-y-1">
                <span className={label}>Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPhoto}
                  className="w-full text-xs text-muted file:mr-3 file:rounded-md file:border file:border-line file:bg-ink-3 file:px-2.5 file:py-1.5 file:text-xs file:text-bone"
                />
                {content.photo ? (
                  <button
                    type="button"
                    onClick={() => patch({ photo: null })}
                    className={minorButton}
                  >
                    Remove photo
                  </button>
                ) : null}
              </label>
            </Fieldset>

            <Fieldset title="Profile">
              <Field
                title="One paragraph per line"
                rows={5}
                value={content.profile.join("\n")}
                onChange={(value) => patch({ profile: fromLines(value) })}
              />
            </Fieldset>

            <Fieldset
              title="Core competencies"
              onAdd={() => add("skills", { title: "", items: [] })}
            >
              {content.skills.map((group, index) => (
                <Row key={index} onRemove={() => remove("skills", index)}>
                  <Field
                    title="Group"
                    value={group.title}
                    onChange={(title) => update("skills", index, { title })}
                    placeholder="Languages & frameworks"
                  />
                  <Field
                    title="Items (comma separated)"
                    rows={2}
                    value={group.items.join(", ")}
                    onChange={(value) =>
                      update("skills", index, { items: fromList(value) })
                    }
                  />
                </Row>
              ))}
            </Fieldset>

            <Fieldset
              title="Experience"
              onAdd={() =>
                add("experience", {
                  title: "",
                  company: "",
                  period: "",
                  summary: "",
                  points: [],
                  tags: [],
                })
              }
            >
              {content.experience.map((role, index) => (
                <Row key={index} onRemove={() => remove("experience", index)}>
                  <Field
                    title="Job title"
                    value={role.title}
                    onChange={(title) => update("experience", index, { title })}
                  />
                  <Field
                    title="Company"
                    value={role.company}
                    onChange={(company) => update("experience", index, { company })}
                  />
                  <Field
                    title="Period"
                    value={role.period}
                    onChange={(period) => update("experience", index, { period })}
                    placeholder="June 2022 — Present"
                  />
                  <Field
                    title="One-line summary"
                    value={role.summary}
                    onChange={(summary) => update("experience", index, { summary })}
                  />
                  <Field
                    title="Bullets (one per line)"
                    rows={4}
                    value={role.points.join("\n")}
                    onChange={(value) =>
                      update("experience", index, { points: fromLines(value) })
                    }
                  />
                  <Field
                    title="Stack (comma separated)"
                    value={role.tags.join(", ")}
                    onChange={(value) =>
                      update("experience", index, { tags: fromList(value) })
                    }
                  />
                </Row>
              ))}
            </Fieldset>

            <Fieldset
              title="Projects"
              onAdd={() =>
                add("projects", { name: "", context: "", url: "", blurb: "", stack: [] })
              }
            >
              {content.projects.map((project, index) => (
                <Row key={index} onRemove={() => remove("projects", index)}>
                  <Field
                    title="Name"
                    value={project.name}
                    onChange={(name) => update("projects", index, { name })}
                  />
                  <Field
                    title="Your role"
                    value={project.context}
                    onChange={(context) => update("projects", index, { context })}
                    placeholder="Front-end developer"
                  />
                  <Field
                    title="URL"
                    value={project.url}
                    onChange={(url) => update("projects", index, { url })}
                  />
                  <Field
                    title="Description"
                    rows={2}
                    value={project.blurb}
                    onChange={(blurb) => update("projects", index, { blurb })}
                  />
                  <Field
                    title="Stack (comma separated)"
                    value={project.stack.join(", ")}
                    onChange={(value) =>
                      update("projects", index, { stack: fromList(value) })
                    }
                  />
                </Row>
              ))}
            </Fieldset>

            <Fieldset
              title="Education"
              onAdd={() => add("education", { degree: "", school: "", period: "" })}
            >
              {content.education.map((entry, index) => (
                <Row key={index} onRemove={() => remove("education", index)}>
                  <Field
                    title="Degree"
                    value={entry.degree}
                    onChange={(degree) => update("education", index, { degree })}
                  />
                  <Field
                    title="School"
                    value={entry.school}
                    onChange={(school) => update("education", index, { school })}
                  />
                  <Field
                    title="Period"
                    value={entry.period}
                    onChange={(period) => update("education", index, { period })}
                  />
                </Row>
              ))}
            </Fieldset>

            <Fieldset
              title="Awards & certifications"
              onAdd={() => add("awards", { title: "", issuer: "", date: "" })}
            >
              {content.awards.map((award, index) => (
                <Row key={index} onRemove={() => remove("awards", index)}>
                  <Field
                    title="Title"
                    value={award.title}
                    onChange={(title) => update("awards", index, { title })}
                  />
                  <Field
                    title="Issuer"
                    value={award.issuer}
                    onChange={(issuer) => update("awards", index, { issuer })}
                  />
                  <Field
                    title="Date"
                    value={award.date}
                    onChange={(date) => update("awards", index, { date })}
                  />
                </Row>
              ))}
            </Fieldset>

            <Fieldset
              title="Character references"
              onAdd={() => add("references", { name: "", title: "", phone: "" })}
            >
              {content.references.map((person, index) => (
                <Row key={index} onRemove={() => remove("references", index)}>
                  <Field
                    title="Name"
                    value={person.name}
                    onChange={(name) => update("references", index, { name })}
                  />
                  <Field
                    title="Title"
                    value={person.title}
                    onChange={(title) => update("references", index, { title })}
                  />
                  <Field
                    title="Phone"
                    value={person.phone}
                    onChange={(phone) => update("references", index, { phone })}
                  />
                </Row>
              ))}
            </Fieldset>

            <Fieldset title="Certification">
              <Field
                title="Closing line (leave empty to omit)"
                rows={2}
                value={content.certification}
                onChange={(certification) => patch({ certification })}
              />
            </Fieldset>
          </form>

          <div className="min-w-0 overflow-x-auto print:overflow-visible">
            <ResumeSheet content={content} template={template} surface={surfaceId} />
          </div>
        </div>
      </div>
    </div>
  );
}
