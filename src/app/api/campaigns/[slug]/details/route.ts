import { getEnv } from "@/lib/env";
import { findOwned } from "@/lib/ownership";

type Ctx = { params: Promise<{ slug: string }> };

/** Editable details of a campaign. POST so the edit key never appears in a URL. */
export async function POST(request: Request, { params }: Ctx) {
	const { slug } = await params;
	const body = (await request.json().catch(() => ({}))) as { key?: unknown };
	const key = typeof body.key === "string" ? body.key.trim() : "";
	const campaign = await findOwned(slug, key);
	if (!campaign) return Response.json({ error: "Incorrect edit key." }, { status: 403 });

	const { DB } = getEnv();
	const { results } = await DB.prepare(
		"SELECT id, width, height, position FROM frames WHERE campaign_id = ? ORDER BY position",
	)
		.bind(campaign.id)
		.all<{ id: string; width: number; height: number; position: number }>();

	const { id: _id, ...publicFields } = campaign;
	void _id;
	return Response.json({ ...publicFields, frames: results });
}
