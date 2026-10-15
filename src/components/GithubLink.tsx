const repoUrl = process.env.NEXT_PUBLIC_REPO_URL;

function parseRepo(url: string | undefined) {
	const m = url?.match(/github\.com\/([^/\s]+)\/([^/\s#?]+)/i);
	return m ? { owner: m[1], name: m[2].replace(/\.git$/, "") } : null;
}

function compact(n: number) {
	return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k` : String(n);
}

/** Star count is fetched on the server (cached for an hour), so visitors never contact GitHub from their browser. */
async function getStars(owner: string, name: string): Promise<number | null> {
	try {
		const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
			headers: { Accept: "application/vnd.github+json", "User-Agent": "openbon" },
			next: { revalidate: 3600 },
		});
		if (!res.ok) return null;
		const data = (await res.json()) as { stargazers_count?: number };
		return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
	} catch {
		return null;
	}
}

function Mark() {
	return (
		<svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
			<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
		</svg>
	);
}

/** GitHub link with a live star count. Renders nothing until NEXT_PUBLIC_REPO_URL points at a GitHub repo. */
export default async function GithubLink({ className = "" }: { className?: string }) {
	const repo = parseRepo(repoUrl);
	if (!repo || !repoUrl) return null;
	const stars = await getStars(repo.owner, repo.name);

	return (
		<a
			href={repoUrl}
			target="_blank"
			rel="noopener noreferrer"
			className={`gh-pill ${className}`}
			aria-label={stars !== null ? `OpenBon on GitHub, ${stars} stars` : "OpenBon on GitHub"}
		>
			<Mark />
			<span>GitHub</span>
			{stars !== null ? (
				<span className="gh-stars">
					<svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
						<path d="M8 .25a.75.75 0 0 1 .67.42l1.88 3.8 4.2.61a.75.75 0 0 1 .42 1.28l-3.04 2.96.72 4.18a.75.75 0 0 1-1.09.79L8 12.3l-3.76 1.98a.75.75 0 0 1-1.09-.79l.72-4.18L.83 6.36a.75.75 0 0 1 .42-1.28l4.2-.61L7.33.67A.75.75 0 0 1 8 .25Z" />
					</svg>
					{compact(stars)}
				</span>
			) : null}
		</a>
	);
}
