import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhotoEditor from "@/components/PhotoEditor";
import ReportButton from "@/components/ReportButton";
import { getCampaignBySlug, getFrames } from "@/lib/campaigns";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const campaign = await getCampaignBySlug(slug);
	if (!campaign) return { title: "Tidak ditemukan" };
	return {
		title: campaign.title,
		description: campaign.description || `Pasang fotomu di frame "${campaign.title}".`,
		robots: campaign.visibility === "unlisted" ? { index: false } : undefined,
	};
}

export default async function CampaignPage({ params }: Props) {
	const { slug } = await params;
	const campaign = await getCampaignBySlug(slug);
	if (!campaign) notFound();
	const frames = await getFrames(campaign.id);
	if (frames.length === 0) notFound();

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{campaign.title}</h1>
				{campaign.description ? <p className="mt-2 max-w-2xl text-muted">{campaign.description}</p> : null}
				<p className="mt-2 text-sm text-muted">Sudah dipakai {campaign.uses.toLocaleString("id-ID")} kali</p>
			</div>

			<PhotoEditor
				slug={campaign.slug}
				frames={frames.map((f) => ({ id: f.id, width: f.width, height: f.height }))}
			/>

			<div className="border-t border-border pt-4">
				<ReportButton slug={campaign.slug} />
			</div>
		</div>
	);
}
