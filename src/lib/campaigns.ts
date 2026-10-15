import { getEnv } from "./env";

export type Campaign = {
	id: string;
	slug: string;
	title: string;
	description: string;
	visibility: "public" | "unlisted";
	uses: number;
	created_at: number;
};

export type Frame = {
	id: string;
	width: number;
	height: number;
	position: number;
};

export type CampaignCard = Campaign & { cover_frame_id: string | null };

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
	const { DB } = getEnv();
	return DB.prepare(
		"SELECT id, slug, title, description, visibility, uses, created_at FROM campaigns WHERE slug = ? AND hidden = 0",
	)
		.bind(slug)
		.first<Campaign>();
}

export async function getFrames(campaignId: string): Promise<Frame[]> {
	const { DB } = getEnv();
	const { results } = await DB.prepare(
		"SELECT id, width, height, position FROM frames WHERE campaign_id = ? ORDER BY position",
	)
		.bind(campaignId)
		.all<Frame>();
	return results;
}

export async function listPublicCampaigns(limit = 48): Promise<CampaignCard[]> {
	const { DB } = getEnv();
	const { results } = await DB.prepare(
		`SELECT c.id, c.slug, c.title, c.description, c.visibility, c.uses, c.created_at,
			(SELECT f.id FROM frames f WHERE f.campaign_id = c.id ORDER BY f.position LIMIT 1) AS cover_frame_id
		FROM campaigns c
		WHERE c.visibility = 'public' AND c.hidden = 0
		ORDER BY c.created_at DESC
		LIMIT ?`,
	)
		.bind(limit)
		.all<CampaignCard>();
	return results;
}
