import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaptionBox from "@/components/CaptionBox";
import PhotoEditor from "@/components/PhotoEditor";
import ReportButton from "@/components/ReportButton";
import { getCampaignBySlug, getFrames } from "@/lib/campaigns";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const { t } = await getT();
	const campaign = await getCampaignBySlug(slug);
	if (!campaign) return { title: t("c.notFound"), robots: { index: false } };
	const description = campaign.description || t("c.defaultDesc", { title: campaign.title });
	const frames = await getFrames(campaign.id);
	const cover = frames[0] ? `/api/frames/${frames[0].id}` : "/og.png";
	const listed = campaign.visibility === "public";
	return {
		title: campaign.title,
		description,
		alternates: { canonical: `/c/${campaign.slug}` },
		robots: listed ? { index: true, follow: true } : { index: false, follow: false },
		openGraph: {
			type: "website",
			title: campaign.title,
			description,
			url: `/c/${campaign.slug}`,
			images: [{ url: cover, alt: campaign.title }],
		},
		twitter: { card: "summary_large_image", title: campaign.title, description, images: [cover] },
	};
}

export default async function CampaignPage({ params }: Props) {
	const { slug } = await params;
	const { t, locale } = await getT();
	const campaign = await getCampaignBySlug(slug);
	if (!campaign) notFound();
	const frames = await getFrames(campaign.id);
	if (frames.length === 0) notFound();

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{campaign.title}</h1>
				{campaign.description ? <p className="mt-2 max-w-2xl text-muted">{campaign.description}</p> : null}
				<p className="mt-3">
					<span className="chip chip-lime -rotate-1">{t("c.used", { n: campaign.uses.toLocaleString(locale === "id" ? "id-ID" : "en-US") })}</span>
				</p>
			</div>

			<PhotoEditor
				slug={campaign.slug}
				frames={frames.map((f) => ({ id: f.id, width: f.width, height: f.height }))}
			/>

			<CaptionBox template={campaign.caption} />

			<div className="border-t-2 border-border pt-4">
				<ReportButton slug={campaign.slug} />
			</div>
		</div>
	);
}
