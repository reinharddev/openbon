import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Sticker from "@/components/Sticker";
import { listPublicCampaigns } from "@/lib/campaigns";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const { t } = await getT();
	return { title: t("explore.meta"), description: t("explore.metaDesc"), alternates: { canonical: "/explore" } };
}

const SHADOWS = ["card-lime", "card-pink", "card-violet"] as const;

export default async function ExplorePage() {
	const { t, locale } = await getT();
	const campaigns = await listPublicCampaigns();

	return (
		<div className="flex flex-col gap-8">
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight">
					{t("explore.title", { mark: "" })}
					<span className="mark">{t("explore.mark")}</span>
				</h1>
				<p className="mt-2 text-muted">{t("explore.sub")}</p>
			</div>

			{campaigns.length === 0 ? (
				<p className="card card-ink p-8 text-center text-muted">
					No public campaigns yet.{" "}
					<Link href="/create" className="font-bold text-accent-ink underline">
						Be the first.
					</Link>
				</p>
			) : (
				<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
					{campaigns.map((c, i) => (
						<Reveal as="li" key={c.id} delay={(i % 4) * 70}>
							<Link href={`/c/${c.slug}`} className={`card ${SHADOWS[i % SHADOWS.length]} block overflow-hidden`}>
								<div className="checker aspect-square border-b-2 border-border">
									{c.cover_frame_id ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={`/api/frames/${c.cover_frame_id}`}
											alt=""
											loading="lazy"
											className="h-full w-full object-contain"
										/>
									) : null}
								</div>
								<div className="p-3">
									<p className="truncate font-extrabold">{c.title}</p>
									<p className="text-xs text-muted">{t("explore.uses", { n: c.uses.toLocaleString(locale === "id" ? "id-ID" : "en-US") })}</p>
								</div>
							</Link>
						</Reveal>
					))}
				</ul>
			)}
		</div>
	);
}
