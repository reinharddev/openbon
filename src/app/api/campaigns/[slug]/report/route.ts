import { getEnv } from "@/lib/env";
import { LIMITS } from "@/lib/limits";

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: Ctx) {
	const { slug } = await params;
	const body = (await request.json().catch(() => ({}))) as { reason?: unknown };
	const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, LIMITS.maxReason) : "";
	const { DB } = getEnv();

	const campaign = await DB.prepare("SELECT id FROM campaigns WHERE slug = ?").bind(slug).first<{ id: string }>();
	if (!campaign) return Response.json({ error: "Kampanye tidak ditemukan." }, { status: 404 });

	await DB.batch([
		DB.prepare("INSERT INTO reports (campaign_id, reason, created_at) VALUES (?, ?, ?)").bind(
			campaign.id,
			reason,
			Date.now(),
		),
		DB.prepare(
			"UPDATE campaigns SET report_count = report_count + 1, hidden = CASE WHEN report_count + 1 >= ? THEN 1 ELSE hidden END WHERE id = ?",
		).bind(LIMITS.hideAfterReports, campaign.id),
	]);

	return new Response(null, { status: 204 });
}
