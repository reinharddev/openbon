import { sha256Hex, timingSafeEqual } from "@/lib/crypto";
import { getEnv } from "@/lib/env";

type Ctx = { params: Promise<{ slug: string }> };

export async function DELETE(request: Request, { params }: Ctx) {
	const { slug } = await params;
	const key = request.headers.get("x-edit-key") ?? "";
	const { DB, FRAMES } = getEnv();

	const campaign = await DB.prepare("SELECT id, edit_key_hash FROM campaigns WHERE slug = ?")
		.bind(slug)
		.first<{ id: string; edit_key_hash: string }>();
	if (!campaign) return Response.json({ error: "Kampanye tidak ditemukan." }, { status: 404 });

	const hash = await sha256Hex(key);
	if (!key || !timingSafeEqual(hash, campaign.edit_key_hash)) {
		return Response.json({ error: "Kunci edit salah." }, { status: 403 });
	}

	const { results } = await DB.prepare("SELECT r2_key FROM frames WHERE campaign_id = ?")
		.bind(campaign.id)
		.all<{ r2_key: string }>();
	await FRAMES.delete(results.map((r) => r.r2_key));
	await DB.batch([
		DB.prepare("DELETE FROM frames WHERE campaign_id = ?").bind(campaign.id),
		DB.prepare("DELETE FROM reports WHERE campaign_id = ?").bind(campaign.id),
		DB.prepare("DELETE FROM campaigns WHERE id = ?").bind(campaign.id),
	]);

	return Response.json({ ok: true });
}
