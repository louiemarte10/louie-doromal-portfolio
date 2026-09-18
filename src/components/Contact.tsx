import { EmailLink } from "@/components/EmailLink";
import { profile } from "@/data/resume";

type Channel = {
  label: string;
  value: string;
  href?: string;
  /** Rendered by EmailLink so the click copies the address as well. */
  email?: boolean;
};

const channels: Channel[] = [
  { label: "Email", value: profile.email, email: true },
  { label: "Phone", value: profile.phone, href: `tel:+63${profile.phone.replace(/\D/g, "").slice(1)}` },
  { label: "GitHub", value: `@${profile.githubHandle}`, href: profile.github },
  { label: "LinkedIn", value: `in/${profile.linkedinHandle}`, href: profile.linkedin },
  { label: "Based in", value: profile.location },
];

const cellLink =
  "mt-2 block break-words text-sm text-bone transition-colors hover:text-accent";

export function Contact() {
  return (
    <section id="contact" className="field scroll-mt-24 border-t border-line/70 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
          06 — Contact
        </p>

        <h2 className="mt-4 max-w-2xl text-2xl font-medium leading-snug text-bone sm:text-4xl">
          Got something that needs building? I am open to talking.
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {channels.map((channel, index) => (
            <div
              key={channel.label}
              className={`bg-ink-2 px-5 py-6 ${
                index === channels.length - 1 ? "sm:max-lg:col-span-2" : ""
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {channel.label}
              </p>
              {channel.email ? (
                <EmailLink
                  email={channel.value}
                  label={channel.value}
                  className={cellLink}
                />
              ) : channel.href ? (
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                  className={cellLink}
                >
                  {channel.value}
                </a>
              ) : (
                <p className="mt-2 text-sm text-bone">{channel.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line/70 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
          Next.js · TypeScript · Tailwind · Vercel
        </p>
      </div>
    </footer>
  );
}
