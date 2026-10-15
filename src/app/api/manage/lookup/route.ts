import { sha256Hex } from "@/lib/crypto";
import { getEnv } from "@/lib/env";

/** Finds a campaign from its edit key, so creators can open Manage without remembering the link. */
export async function POST(request: Request) {
	const body = (await request.json().catch(() => ({}))) as { key?: unknown };
	const key = typeof body.key === "string" ? body.key.trim() : "";
	if (key.length < 16 || key.length > 128) {
		return Response.json({ error: "Edit key not found." }, { status: 404 });
	}
	const { DB } = getEnv();
	const row = await DB.prepare("SELECT slug FROM campaigns WHERE edit_key_hash = ?")
		.bind(await sha256Hex(key))
		.first<{ slug: string }>();
	if (!row) return Response.json({ error: "Edit key not found." }, { status: 404 });
	return Response.json({ slug: row.slug });
}
