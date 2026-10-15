import Link from "next/link";
import HeroMock from "@/components/HeroMock";
import Icon, { type IconName } from "@/components/Icon";

const features: { icon: IconName; title: string; body: string }[] = [
	{ icon: "image", title: "No watermark", body: "Every download is clean. Frames and photos come out exactly as you made them." },
	{ icon: "ban", title: "No ads", body: "No banners, no popups, no sponsored placements between you and your campaign." },
	{ icon: "shield", title: "Private by design", body: "Photos are composed in the browser. They are never uploaded or stored on a server." },
	{ icon: "layers", title: "Multiple frames", body: "Offer up to 10 frame variations in a single campaign and let people choose." },
	{ icon: "link", title: "Public or link-only", body: "List your campaign on Explore, or keep it reachable only by those who have the link." },
	{ icon: "user", title: "No account needed", body: "Participants just open the link. Creators get a share link and an edit key." },
];

const steps = [
	{ title: "Upload a frame", body: "Upload a transparent PNG. One campaign can have up to 10 frames." },
	{ title: "Share the link", body: "Send it to friends, your team, or your community. No account needed." },
	{ title: "Add a photo", body: "Participants pick a photo, adjust its position, and download the result." },
];

const faqs = [
	{
		q: "Is it really free?",
		a: "Yes. There are no paid tiers, no watermark, and no ads. Hosting is covered by voluntary donations.",
	},
	{
		q: "Where do my photos go?",
		a: "Nowhere. Photos are placed on the frame by your browser and downloaded straight to your device. Only the frame file itself is stored on the server.",
	},
	{
		q: "What do I need to make a frame?",
		a: "A transparent PNG between 200 and 2048 pixels, up to 2 MB. Any design tool that exports PNG will work, and a square canvas gives the best result.",
	},
	{
		q: "Do I need an account?",
		a: "No. Creating a campaign gives you a share link and a private edit key to manage or delete it later. Keep the key safe, since it can't be recovered.",
	},
	{
		q: "Can I self-host it?",
		a: "Yes. OpenBon is open source under AGPL-3.0 and runs on Cloudflare Workers, D1, and R2. The README has the steps.",
	},
];

export default function Home() {
	return (
		<div className="flex flex-col gap-24 pb-8">
			<section className="grid items-center gap-10 pt-4 md:grid-cols-2">
				<div className="flex flex-col items-start gap-6">
					<span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
						Open source · AGPL-3.0
					</span>
					<h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
						Free photo frames for any campaign.
					</h1>
					<p className="max-w-lg text-lg text-muted">
						Create a frame, share one link, and let anyone add their photo. No watermark, no ads, and photos
						never leave the browser.
					</p>
					<div className="flex flex-wrap gap-3">
						<Link
							href="/create"
							className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-medium text-accent-foreground hover:opacity-90"
						>
							Create campaign
							<Icon name="arrow" className="h-4 w-4" />
						</Link>
						<Link
							href="/explore"
							className="rounded-md border border-border bg-surface px-5 py-3 font-medium hover:border-accent"
						>
							Browse public campaigns
						</Link>
					</div>
				</div>
				<div className="mx-auto w-full max-w-sm md:max-w-none">
					<HeroMock />
				</div>
			</section>

			<section aria-labelledby="features">
				<div className="mb-8 max-w-xl">
					<h2 id="features" className="text-2xl font-semibold tracking-tight">
						Everything that's usually paid, included.
					</h2>
					<p className="mt-2 text-muted">One product for everyone. Nothing is locked behind a tier.</p>
				</div>
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((f) => (
						<li key={f.title} className="rounded-xl border border-border bg-surface p-5">
							<span className="mb-3 inline-flex text-accent">
								<Icon name={f.icon} className="h-6 w-6" />
							</span>
							<h3 className="mb-1 font-semibold">{f.title}</h3>
							<p className="text-sm text-muted">{f.body}</p>
						</li>
					))}
				</ul>
			</section>

			<section aria-labelledby="how">
				<h2 id="how" className="mb-8 text-2xl font-semibold tracking-tight">
					How it works
				</h2>
				<ol className="grid gap-4 md:grid-cols-3">
					{steps.map((step, i) => (
						<li key={step.title} className="flex gap-4 rounded-xl border border-border bg-surface p-5">
							<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
								{i + 1}
							</span>
							<div>
								<h3 className="mb-1 font-semibold">{step.title}</h3>
								<p className="text-sm text-muted">{step.body}</p>
							</div>
						</li>
					))}
				</ol>
			</section>

			<section
				aria-labelledby="privacy"
				className="grid gap-8 rounded-2xl border border-border bg-surface p-8 md:grid-cols-2"
			>
				<div>
					<h2 id="privacy" className="text-2xl font-semibold tracking-tight">
						Your photo stays on your device.
					</h2>
					<p className="mt-2 text-muted">
						OpenBon is built so that there is nothing to leak: no uploads, no profiles, and no tracking of
						who uses what.
					</p>
				</div>
				<ul className="flex flex-col gap-3 text-sm">
					{[
						"Photos are composed on a canvas in your browser",
						"Only the creator's frame file is stored on the server",
						"No analytics, no ad networks, no third-party trackers",
						"Each campaign shows just one anonymous usage counter",
					].map((item) => (
						<li key={item} className="flex items-start gap-3">
							<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3" aria-hidden="true">
									<path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</span>
							<span>{item}</span>
						</li>
					))}
				</ul>
			</section>

			<section aria-labelledby="faq" className="grid gap-8 md:grid-cols-[1fr_2fr]">
				<h2 id="faq" className="text-2xl font-semibold tracking-tight">
					Questions
				</h2>
				<dl className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
					{faqs.map((item) => (
						<div key={item.q} className="p-5">
							<dt className="font-semibold">{item.q}</dt>
							<dd className="mt-1 text-sm text-muted">{item.a}</dd>
						</div>
					))}
				</dl>
			</section>

			<section className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">Ready to make your first frame?</h2>
					<p className="mt-1 text-muted">It takes about a minute, and you don't need an account.</p>
				</div>
				<Link
					href="/create"
					className="inline-flex shrink-0 items-center gap-2 rounded-md bg-accent px-5 py-3 font-medium text-accent-foreground hover:opacity-90"
				>
					Create campaign
					<Icon name="arrow" className="h-4 w-4" />
				</Link>
			</section>
		</div>
	);
}
