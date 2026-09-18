import { Section } from "@/components/Section";
import { profile, repoFallback, type Repo } from "@/data/resume";

const HIDDEN = new Set(["louiemarte10", "test", "profile-tools"]);

async function getRepos(): Promise<{ repos: Repo[]; live: boolean }> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${profile.githubHandle}/repos?per_page=100&sort=pushed`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) return { repos: repoFallback, live: false };

    const raw = (await res.json()) as (Repo & { fork: boolean; archived: boolean })[];
    const repos = raw
      .filter((repo) => !repo.fork && !repo.archived && !HIDDEN.has(repo.name))
      .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
      .slice(0, 6);

    return repos.length ? { repos, live: true } : { repos: repoFallback, live: false };
  } catch {
    return { repos: repoFallback, live: false };
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export async function RecentWork() {
  const { repos, live } = await getRepos();

  return (
    <Section
      id="recent"
      index="04"
      title="Recent activity"
      lead="What I have been pushing to GitHub lately."
    >
      <div className="overflow-hidden rounded-lg border border-line">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col gap-2 border-b border-line bg-ink-2 px-6 py-5 transition-colors last:border-b-0 hover:bg-ink-3 sm:flex-row sm:items-center sm:gap-6"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-mono text-sm text-bone transition-colors group-hover:text-accent">
                {repo.name}
              </h3>
              {repo.description ? (
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {repo.description}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-4 font-mono text-[11px] text-muted">
              {repo.language ? (
                <span className="rounded border border-line px-1.5 py-0.5">
                  {repo.language}
                </span>
              ) : null}
              <span>{formatDate(repo.pushed_at)}</span>
              <span aria-hidden className="text-accent opacity-0 transition-opacity group-hover:opacity-100">
                ↗
              </span>
            </div>
          </a>
        ))}
      </div>

      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <span>
          {live
            ? "Pulled live from the GitHub API, refreshed hourly."
            : "Showing a cached snapshot — the GitHub API was unreachable."}
        </span>
        <a
          href={`${profile.github}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="text-accent transition-opacity hover:opacity-75"
        >
          All repositories ↗
        </a>
      </p>
    </Section>
  );
}
