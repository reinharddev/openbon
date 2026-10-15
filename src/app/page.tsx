import Link from "next/link";

const steps = [
	{ title: "Upload a frame", body: "Upload a transparent PNG. One campaign can have up to 10 frames." },
	{ title: "Share the link", body: "Send it to friends, your team, or your community. No account needed." },
	{ title: "Add a photo", body: "Participants pick a photo, adjust its position, and download the result." },
];

export default function Home() {
	return (
		<div className="flex flex-col gap-14">
			<section className="flex flex-col items-start gap-5 pt-6">
				<h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
					Free photo frames, no watermark.
				</h1>
				<p className="max-w-xl text-lg text-muted">
					OpenBon is an open source tool for creating photo frames for campaigns, events, and communities. No ads, no paid-only features, and photos never leave the browser.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link
						href="/create"
						className="rounded-md bg-accent px-4 py-2.5 font-medium text-accent-foreground hover:opacity-90"
					>
						Create campaign
					</Link>
					<Link href="/explore" className="rounded-md border border-border px-4 py-2.5 font-medium hover:bg-surface">
						Browse public campaigns
					</Link>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">How it works</h2>
				<ol className="grid gap-4 sm:grid-cols-3">
					{steps.map((step, i) => (
						<li key={step.title} className="rounded-lg border border-border bg-surface p-5">
							<p className="mb-2 text-sm text-muted">Step {i + 1}</p>
							<h3 className="mb-1 font-semibold">{step.title}</h3>
							<p className="text-sm text-muted">{step.body}</p>
						</li>
					))}
				</ol>
			</section>
		</div>
	);
}
