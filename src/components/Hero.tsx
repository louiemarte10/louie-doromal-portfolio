import { EmailLink } from "@/components/EmailLink";
import { VoiceIntro } from "@/components/VoiceIntro";
import { profile, stats } from "@/data/resume";

export function Hero() {
  return (
    <section id="top" className="field relative overflow-hidden">
      <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-20 sm:pb-28 sm:pt-28">
        <div className="reveal">
          <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {profile.location}
          </p>

          <h1 className="mt-7 text-4xl font-medium leading-[1.08] tracking-tight text-bone sm:text-6xl">
            {profile.name}
          </h1>

          <p className="mt-4 text-lg text-accent sm:text-xl">{profile.role}</p>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.tagline}
          </p>

          <div className="mt-7">
            <VoiceIntro />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-85"
            >
              See the work
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-5 py-2.5 text-sm text-bone transition-colors hover:border-accent hover:text-accent"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-5 py-2.5 text-sm text-bone transition-colors hover:border-accent hover:text-accent"
            >
              LinkedIn
            </a>
            <EmailLink
              email={profile.email}
              label="Email me"
              copiedLabel="Email copied ✓"
              className="rounded-full border border-line px-5 py-2.5 text-sm text-bone transition-colors hover:border-accent hover:text-accent"
            />
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-ink-2 px-5 py-6">
              <dt className="text-xs text-muted">{stat.label}</dt>
              <dd className="mt-1.5 font-mono text-2xl text-bone">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
