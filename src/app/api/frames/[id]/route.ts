import { getEnv } from "@/lib/env";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
	const { id } = await params;
	const { DB, FRAMES } = getEnv();

	const row = await DB.prepare(
		"SELECT f.r2_key FROM frames f JOIN campaigns c ON c.id = f.campaign_id WHERE f.id = ? AND c.hidden = 0",
	)
		.bind(id)
		.first<{ r2_key: string }>();
	if (!row) return new Response("Not found", { status: 404 });

	const object = await FRAMES.get(row.r2_key);
	if (!object) return new Response("Not found", { status: 404 });

	return new Response(object.body, {
		headers: {
			"content-type": "image/png",
			"cache-control": "public, max-age=31536000, immutable",
		},
	});
}
