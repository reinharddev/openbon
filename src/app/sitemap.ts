import type { MetadataRoute } from "next";
import { listPublicCampaigns } from "@/lib/campaigns";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const pages: MetadataRoute.Sitemap = [
		{ url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
		{ url: `${SITE_URL}/create`, changeFrequency: "yearly", priority: 0.8 },
		{ url: `${SITE_URL}/explore`, changeFrequency: "daily", priority: 0.7 },
		{ url: `${SITE_URL}/thanks`, changeFrequency: "monthly", priority: 0.3 },
	];
	try {
		const campaigns = await listPublicCampaigns(500);
		return [
			...pages,
			...campaigns.map((c) => ({
				url: `${SITE_URL}/c/${c.slug}`,
				lastModified: new Date(c.created_at),
				changeFrequency: "monthly" as const,
				priority: 0.5,
			})),
		];
	} catch {
		return pages;
	}
}
