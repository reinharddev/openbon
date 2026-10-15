import Link from "next/link";
import AnimatedIcon, { type AnimatedIconName } from "@/components/AnimatedIcon";
import FunTip from "@/components/FunTip";
import HeroMock from "@/components/HeroMock";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import StepBadge from "@/components/StepBadge";
import type { DictKey, Translate } from "@/lib/i18n/dict";
import { getT } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/site";

const repoUrl = process.env.NEXT_PUBLIC_REPO_URL;

const featureDefs: { icon: AnimatedIconName; n: 1 | 2 | 3 | 4 | 5 | 6; shadow: string; tilt: string }[] = [
	{ icon: "image", n: 1, shadow: "card-lime", tilt: "-rotate-1" },
	{ icon: "ban", n: 2, shadow: "card-pink", tilt: "rotate-1" },
	{ icon: "shield", n: 3, shadow: "card-violet", tilt: "-rotate-1" },
	{ icon: "layers", n: 4, shadow: "card-violet", tilt: "rotate-1" },
	{ icon: "link", n: 5, shadow: "card-lime", tilt: "-rotate-1" },
	{ icon: "user", n: 6, shadow: "card-pink", tilt: "rotate-1" },
];

const NUMS = [1, 2, 3, 4, 5, 6] as const;
const key = (k: string) => k as DictKey;

function buildJsonLd(t: Translate) {
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebApplication",
				name: "OpenBon",
				url: SITE_URL,
				description: t("meta.description"),
				applicationCategory: "MultimediaApplication",
				operatingSystem: "Any",
				browserRequirements: "Requires JavaScript",
				isAccessibleForFree: true,
				license: "https://www.gnu.org/licenses/agpl-3.0.html",
				offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
			},
			{
				"@type": "FAQPage",
				mainEntity: NUMS.map((n) => ({
					"@type": "Question",
					name: t(key(`q${n}`)),
					acceptedAnswer: { "@type": "Answer", text: t(key(`a${n}`)) },
				})),
			},
		],
	};
}

function Word({ i, children }: { i: number; children: React.ReactNode }) {
	return (
		<span className="hw" style={{ "--i": i } as React.CSSProperties}>
			{children}
		</span>
	);
}

export default async function Home() {
	const { t } = await getT();
	const jsonLd = buildJsonLd(t);

	const line1 = t("hero.h1a").split(" ");
	const hl = t("hero.h1hl");
	const line2 = t("hero.h1b").split(" ");
	const makeTips = t("tips.make").split("|");
	const galleryTips = t("tips.gallery").split("|");

	return (
		<div className="flex flex-col gap-24 pb-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
			/>

			<section className="grid items-center gap-10 pt-2 md:grid-cols-2">
				<div className="flex flex-col items-start gap-6">
					<span className="chip chip-violet hero-in -rotate-2" style={{ "--d": "0s" } as React.CSSProperties}>
						{t("hero.chip")}
					</span>
					<h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
						{line1.map((w, i) => (
							<span key={`a${i}`}>
								<Word i={i}>{w}</Word>{" "}
							</span>
						))}
						<br />
						<Word i={line1.length}>
							<span className="hl" data-text={hl}>
								{hl}
							</span>
						</Word>{" "}
						{line2.map((w, i) => (
							<span key={`b${i}`}>
								<Word i={line1.length + 1 + i}>{w}</Word>
								{i < line2.length - 1 ? " " : ""}
							</span>
						))}
					</h1>
					<p className="hero-in max-w-lg text-lg text-muted" style={{ "--d": "0.75s" } as React.CSSProperties}>
						{t("hero.sub")}
					</p>
					<div className="hero-btns flex flex-wrap gap-4">
						<FunTip messages={makeTips}>
							<Link href="/create" className="btn btn-lime">
								{t("hero.cta")}
								<Icon name="arrow" className="h-4 w-4" />
							</Link>
						</FunTip>
						<FunTip messages={galleryTips}>
							<Link href="/explore" className="btn btn-ghost">
								{t("hero.gallery")}
							</Link>
						</FunTip>
					</div>
				</div>
				<Reveal delay={150}>
					<HeroMock joinLabel={t("mock.join")} />
				</Reveal>
			</section>

			<section aria-labelledby="features">
				<Reveal>
					<h2 id="features" className="mb-8 max-w-xl text-3xl font-extrabold tracking-tight">
						{t("feat.title")}
						<span className="mark ml-2">{t("feat.mark")}</span>
					</h2>
				</Reveal>
				<ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{featureDefs.map((f, i) => (
						<li key={f.n}>
							<Reveal delay={(i % 3) * 110} className="h-full">
								<div className={`card ico-host h-full ${f.shadow} ${f.tilt} p-5`}>
									<span className="mb-3 inline-flex">
										<AnimatedIcon name={f.icon} />
									</span>
									<h3 className="mb-1 text-lg font-extrabold">{t(key(`f${f.n}.t`))}</h3>
									<p className="text-sm text-muted">{t(key(`f${f.n}.b`))}</p>
								</div>
							</Reveal>
						</li>
					))}
				</ul>
			</section>

			<section aria-labelledby="how">
				<Reveal>
					<h2 id="how" className="mb-8 text-3xl font-extrabold tracking-tight">
						{t("how.title")}
					</h2>
				</Reveal>
				<ol className="grid gap-6 md:grid-cols-3">
					{([1, 2, 3] as const).map((n, i) => (
						<li key={n}>
							<Reveal delay={i * 120} className="h-full">
								<div className="card card-ink step-host flex h-full gap-4 p-5">
									<StepBadge n={n} />
									<div>
										<h3 className="mb-1 font-extrabold">{t(key(`s${n}.t`))}</h3>
										<p className="text-sm text-muted">{t(key(`s${n}.b`))}</p>
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
							{t("priv.title")}
						</h2>
						<p className="mt-2 text-muted">{t("priv.body")}</p>
					</div>
					<ul className="flex flex-col gap-3 text-sm font-bold">
						{(["priv.1", "priv.2", "priv.3", "priv.4"] as const).map((k) => (
							<li key={k} className="flex items-start gap-3">
								<span className="chip chip-lime mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center p-0">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="h-3 w-3" aria-hidden="true">
										<path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</span>
								<span>{t(k)}</span>
							</li>
						))}
					</ul>
				</div>
			</Reveal>

			<section aria-labelledby="faq" className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] md:items-start">
				<Reveal className="md:sticky md:top-8">
					<span className="chip chip-pink -rotate-2">{t("faq.chip")}</span>
					<h2 id="faq" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
						{t("faq.title", { mark: "" })}
						<span className="mark">{t("faq.mark")}</span>
					</h2>
					<p className="mt-3 max-w-sm text-muted">{t("faq.sub")}</p>
					{repoUrl ? (
						<a
							href={`${repoUrl}/issues`}
							target="_blank"
							rel="noopener noreferrer"
							className="card card-violet tap mt-6 block max-w-sm -rotate-1 p-4 text-sm"
						>
							<span className="block font-extrabold">{t("faq.stuck")}</span>
							<span className="text-muted">{t("faq.stuckBody")}</span>
						</a>
					) : null}
				</Reveal>
				<ul className="flex flex-col gap-4">
					{NUMS.map((n, i) => (
						<li key={n}>
							<Reveal delay={i * 70}>
								<details name="faq" className="faq" open={i === 0}>
									<summary className="faq-q">
										<span className="faq-num" aria-hidden="true">
											{n}
										</span>
										<span className="faq-text">{t(key(`q${n}`))}</span>
										<span className="faq-plus" aria-hidden="true">
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
												<path d="M12 5v14M5 12h14" />
											</svg>
										</span>
									</summary>
									<div className="faq-a">
										<p>{t(key(`a${n}`))}</p>
									</div>
								</details>
							</Reveal>
						</li>
					))}
				</ul>
			</section>

			<Reveal as="section">
				<div className="card card-pink flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-3xl font-extrabold tracking-tight">{t("cta.title")}</h2>
						<p className="mt-1 text-muted">{t("cta.body")}</p>
					</div>
					<Link href="/create" className="btn btn-lime shrink-0">
						{t("hero.cta")}
						<Icon name="arrow" className="h-4 w-4" />
					</Link>
				</div>
			</Reveal>
		</div>
	);
}
