import type { Metadata } from "next";
import { supporters } from "@/content/supporters";

export const metadata: Metadata = { title: "Special thanks" };

const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL;

export default function ThanksPage() {
	const list = [...supporters].reverse();

	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-8">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Special thanks</h1>
				<p className="mt-2 text-muted">
					OpenBon is free, with no ads and no watermark. These people help keep it running. Supporter names may be
					listed here.
				</p>
			</div>

			{list.length === 0 ? (
				<div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
					<p className="text-muted">No supporters listed yet. You could be the first.</p>
					{donateUrl ? (
						<a
							href={donateUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-4 inline-block rounded-md bg-accent px-4 py-2 font-medium text-accent-foreground hover:opacity-90"
						>
							Support OpenBon
						</a>
					) : null}
				</div>
			) : (
				<ul className="grid gap-3 sm:grid-cols-2">
					{list.map((s) => (
						<li
							key={`${s.name}-${s.date ?? ""}`}
							className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3"
						>
							<span className="truncate font-medium">{s.name}</span>
							{s.date ? <span className="shrink-0 text-xs text-muted">{s.date}</span> : null}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
