import Link from "next/link";
import FunTip from "@/components/FunTip";
import HeroMock from "@/components/HeroMock";
import Reveal from "@/components/Reveal";
import AnimatedIcon, { type AnimatedIconName } from "@/components/AnimatedIcon";
import Icon from "@/components/Icon";
import StepBadge from "@/components/StepBadge";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

const features: { icon: AnimatedIconName; title: string; body: string; shadow: string; tilt: string }[] = [
	{ icon: "image", title: "No watermark", body: "Clean downloads. Frames and photos come out exactly as you made them.", shadow: "card-lime", tilt: "-rotate-1" },
	{ icon: "ban", title: "No ads", body: "Not a single banner, popup, or sponsored anything between you and your campaign.", shadow: "card-pink", tilt: "rotate-1" },
	{ icon: "shield", title: "Stays on your device", body: "Photos are composed in your browser. They never get uploaded.", shadow: "card-violet", tilt: "-rotate-1" },
	{ icon: "layers", title: "Up to 10 frames", body: "Give people options. One campaign, as many as ten frame variations.", shadow: "card-violet", tilt: "rotate-1" },
	{ icon: "link", title: "Public or link-only", body: "List it on Explore, or keep it hidden for people who have the link.", shadow: "card-lime", tilt: "-rotate-1" },
	{ icon: "user", title: "No account needed", body: "Participants just open the link. Creators get a share link and an edit key.", shadow: "card-pink", tilt: "rotate-1" },
];

const makeTips = [
	"Do it, do it!",
	"Psst... it's free.",
	"Your face deserves a frame.",
	"Ooh, bold choice.",
	"No watermark. Promise.",
	"Go on then...",
	"Frames are fun!",
	"Click me, I dare you.",
];

const galleryTips = [
	"Just peeking? Same.",
	"Nosy. I like it.",
	"Other people's frames!",
	"Browse responsibly.",
	"So many frames...",
	"Look, but also touch.",
	"Gallery time!",
];

const steps = [
	{ title: "Upload a frame", body: "Drop in a transparent PNG. One campaign can have up to 10 frames." },
	{ title: "Share the link", body: "Send it to friends, your team, or your community. No account needed." },
	{ title: "Add a photo", body: "Pick a photo, move it around, download. That's it." },
];

const faqs = [
	{ q: "Is it really free?", a: "Yes. No paid tiers, no watermark, no ads!" },
	{
		q: "Where do my photos go?",
		a: "Nowhere. Your browser places the photo on the frame and saves it straight to your device. Only the frame file is stored on the server.",
	},
	{
		q: "What do I need to make a frame?",
		a: "A transparent PNG between 200 and 2048 pixels, up to 2 MB. Any design tool that exports PNG works, and a square canvas looks best.",
	},
	{
		q: "Do I need an account?",
		a: "Nope. Making a campaign gives you a share link and a private edit key to manage or delete it later. Keep the key safe, it can't be recovered.",
	},
	{
		q: "Can I self-host it?",
		a: "Sure. OpenBon is open source under AGPL-3.0 and runs on Cloudflare Workers, D1, and R2. The README has the steps.",
	},
];

const jsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebApplication",
			name: "OpenBon",
			url: SITE_URL,
			description: SITE_DESCRIPTION,
			applicationCategory: "MultimediaApplication",
			operatingSystem: "Any",
			browserRequirements: "Requires JavaScript",
			isAccessibleForFree: true,
			license: "https://www.gnu.org/licenses/agpl-3.0.html",
			offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
		},
		{
			"@type": "FAQPage",
			mainEntity: faqs.map((f) => ({
				"@type": "Question",
				name: f.q,
				acceptedAnswer: { "@type": "Answer", text: f.a },
			})),
		},
	],
};

export default function Home() {
	return (
		<div className="flex flex-col gap-24 pb-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
			/>
			<section className="grid items-center gap-10 pt-2 md:grid-cols-2">
				<div className="flex flex-col items-start gap-6">
					<span className="chip chip-violet hero-in -rotate-2" style={{ "--d": "0s" } as React.CSSProperties}>
							Open source · AGPL-3.0
						</span>
					<h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
						<span className="hw" style={{ "--i": 0 } as React.CSSProperties}>
							Frame
						</span>{" "}
						<span className="hw" style={{ "--i": 1 } as React.CSSProperties}>
							your
						</span>{" "}
						<span className="hw" style={{ "--i": 2 } as React.CSSProperties}>
							face.
						</span>
						<br />
						<span className="hw" style={{ "--i": 3 } as React.CSSProperties}>
							<span className="hl" data-text="For free.">
								For free.
							</span>
						</span>{" "}
						<span className="hw" style={{ "--i": 4 } as React.CSSProperties}>
							No
						</span>{" "}
						<span className="hw" style={{ "--i": 5 } as React.CSSProperties}>
							strings.
						</span>
					</h1>
					<p className="hero-in max-w-lg text-lg text-muted" style={{ "--d": "0.75s" } as React.CSSProperties}>
						Make a photo frame, share one link, and let anyone drop their pic in. No watermark, no ads, no catch.
					</p>
					<div className="flex flex-wrap gap-4">
						<FunTip messages={makeTips}>
							<Link href="/create" className="btn btn-lime">
								Make a frame
								<Icon name="arrow" className="h-4 w-4" />
							</Link>
						</FunTip>
						<FunTip messages={galleryTips}>
							<Link href="/explore" className="btn btn-ghost">
								Peek at the gallery
							</Link>
						</FunTip>
					</div>
				</div>
				<Reveal delay={150}>
					<HeroMock />
				</Reveal>
			</section>

			<section aria-labelledby="features">
				<Reveal>
					<h2 id="features" className="mb-8 max-w-xl text-3xl font-extrabold tracking-tight">
						Everything that's usually paid.
						<span className="mark ml-2">Included.</span>
					</h2>
				</Reveal>
				<ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((f, i) => (
						<li key={f.title}>
							<Reveal delay={(i % 3) * 110} className="h-full">
								<div className={`card ico-host h-full ${f.shadow} ${f.tilt} p-5`}>
									<span className="mb-3 inline-flex">
										<AnimatedIcon name={f.icon} />
									</span>
									<h3 className="mb-1 text-lg font-extrabold">{f.title}</h3>
									<p className="text-sm text-muted">{f.body}</p>
								</div>
							</Reveal>
						</li>
					))}
				</ul>
			</section>

			<section aria-labelledby="how">
				<Reveal>
					<h2 id="how" className="mb-8 text-3xl font-extrabold tracking-tight">
						How it works
					</h2>
				</Reveal>
				<ol className="grid gap-6 md:grid-cols-3">
					{steps.map((step, i) => (
						<li key={step.title}>
							<Reveal delay={i * 120} className="h-full">
								<div className="card card-ink step-host flex h-full gap-4 p-5">
									<StepBadge n={(i + 1) as 1 | 2 | 3} />
									<div>
										<h3 className="mb-1 font-extrabold">{step.title}</h3>
										<p className="text-sm text-muted">{step.body}</p>
									</div>
								</div>
							</Reveal>
						</li>
					))}
				</ol>
			</section>

			<Reveal as="section">
				<div role="region" aria-labelledby="privacy" className="card card-violet grid gap-8 p-8 md:grid-cols-2">
					<div>
						<h2 id="privacy" className="text-3xl font-extrabold tracking-tight">
							Your photo stays on your device.
						</h2>
						<p className="mt-2 text-muted">
							There's nothing to leak: no uploads, no profiles, and no tracking of who uses what.
						</p>
					</div>
					<ul className="flex flex-col gap-3 text-sm font-bold">
						{[
							"Photos are composed on a canvas in your browser",
							"Only the creator's frame file is stored on the server",
							"No analytics, no ad networks, no third-party trackers",
							"Each campaign shows one anonymous usage counter",
						].map((item) => (
							<li key={item} className="flex items-start gap-3">
								<span className="chip chip-lime mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center p-0">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="h-3 w-3" aria-hidden="true">
										<path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</span>
								<span>{item}</span>
							</li>
						))}
					</ul>
				</div>
			</Reveal>

			<section aria-labelledby="faq" className="grid gap-8 md:grid-cols-[1fr_2fr]">
				<Reveal>
					<h2 id="faq" className="text-3xl font-extrabold tracking-tight">
						Questions
					</h2>
				</Reveal>
				<ul className="flex flex-col gap-4">
					{faqs.map((item, i) => (
						<li key={item.q}>
							<Reveal delay={i * 70}>
								<div className={`card p-5 ${i % 2 === 0 ? "card-lime" : "card-pink"}`}>
									<h3 className="font-extrabold">{item.q}</h3>
									<p className="mt-1 text-sm text-muted">{item.a}</p>
								</div>
							</Reveal>
						</li>
					))}
				</ul>
			</section>

			<Reveal as="section">
				<div className="card card-pink flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-3xl font-extrabold tracking-tight">Ready to make your first frame?</h2>
						<p className="mt-1 text-muted">Takes about a minute. No account, no catch.</p>
					</div>
					<Link href="/create" className="btn btn-lime shrink-0">
						Make a frame
						<Icon name="arrow" className="h-4 w-4" />
					</Link>
				</div>
			</Reveal>
		</div>
	);
}
