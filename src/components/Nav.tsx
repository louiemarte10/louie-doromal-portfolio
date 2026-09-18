import Link from "next/link";
import { profile } from "@/data/resume";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#recent", label: "Recent" },
  { href: "#background", label: "Background" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-full border border-accent/40 font-mono text-[11px] text-accent transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
            LD
          </span>
          <span className="text-sm font-medium tracking-tight text-bone">
            {profile.shortName}
          </span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-bone"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <Link
            href="/resume"
            className="rounded-full border border-line px-4 py-1.5 text-sm text-bone transition-colors hover:border-accent hover:text-accent"
          >
            Resume
          </Link>
          <a
            href="#contact"
            className="hidden rounded-full border border-line px-4 py-1.5 text-sm text-bone transition-colors hover:border-accent hover:text-accent sm:inline-block"
          >
            Get in touch
          </a>
        </div>
      </nav>
    </header>
  );
}
