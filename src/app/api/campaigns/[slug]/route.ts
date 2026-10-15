import { sha256Hex, timingSafeEqual } from "@/lib/crypto";
import { getEnv } from "@/lib/env";
import { LIMITS } from "@/lib/limits";
import { findOwned } from "@/lib/ownership";
import { readPngSize } from "@/lib/png";

type Ctx = { params: Promise<{ slug: string }> };

export async function DELETE(request: Request, { params }: Ctx) {
	const { slug } = await params;
	const key = request.headers.get("x-edit-key") ?? "";
	const { DB, FRAMES } = getEnv();

	const campaign = await DB.prepare("SELECT id, edit_key_hash FROM campaigns WHERE slug = ?")
		.bind(slug)
		.first<{ id: string; edit_key_hash: string }>();
	if (!campaign) return Response.json({ error: "Campaign not found." }, { status: 404 });

	const hash = await sha256Hex(key);
	if (!key || !timingSafeEqual(hash, campaign.edit_key_hash)) {
		return Response.json({ error: "Incorrect edit key." }, { status: 403 });
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

function fail(message: string, status = 400) {
	return Response.json({ error: message }, { status });
}

/** Edit text fields and visibility, remove frames, and add new ones. Multipart form, edit key in x-edit-key. */
export async function PATCH(request: Request, { params }: Ctx) {
	const { slug } = await params;
	const key = request.headers.get("x-edit-key") ?? "";
	const campaign = await findOwned(slug, key);
	if (!campaign) return fail("Incorrect edit key.", 403);

	const form = await request.formData();
	const title = String(form.get("title") ?? campaign.title).trim();
	const description = String(form.get("description") ?? campaign.description).trim();
	const caption = String(form.get("caption") ?? campaign.caption).trim();
	const visibilityRaw = form.get("visibility");
	const visibility =
		visibilityRaw === "public" || visibilityRaw === "unlisted" ? visibilityRaw : campaign.visibility;

	let removeIds: string[] = [];
	try {
		const parsed = JSON.parse(String(form.get("removeFrames") ?? "[]")) as unknown;
		if (Array.isArray(parsed)) removeIds = parsed.filter((x): x is string => typeof x === "string");
	} catch {
		return fail("Invalid frame list.");
	}
	const files = form.getAll("addFrames").filter((f): f is File => typeof f !== "string");

	if (!title || title.length > LIMITS.maxTitle) return fail(`Title is required (max ${LIMITS.maxTitle} characters).`);
	if (description.length > LIMITS.maxDescription) return fail(`Description must be at most ${LIMITS.maxDescription} characters.`);
	if (caption.length > LIMITS.maxCaption) return fail(`Caption must be at most ${LIMITS.maxCaption} characters.`);

	const { DB, FRAMES } = getEnv();
	const { results: current } = await DB.prepare(
		"SELECT id, r2_key, position FROM frames WHERE campaign_id = ? ORDER BY position",
	)
		.bind(campaign.id)
		.all<{ id: string; r2_key: string; position: number }>();

	const removing = current.filter((f) => removeIds.includes(f.id));
	const remaining = current.length - removing.length;
	if (remaining + files.length < 1) return fail("Keep at least one frame.");
	if (remaining + files.length > LIMITS.maxFrames) return fail(`A campaign can have at most ${LIMITS.maxFrames} frames.`);

	const parsedFiles: { bytes: Uint8Array; width: number; height: number }[] = [];
	for (const file of files) {
		if (file.size > LIMITS.maxFrameBytes) return fail("Each frame must be 2 MB or smaller.");
		const bytes = new Uint8Array(await file.arrayBuffer());
		const size = readPngSize(bytes);
		if (!size) return fail("Frames must be PNG files (with a transparent background).");
		if (Math.min(size.width, size.height) < LIMITS.minFrameSize || Math.max(size.width, size.height) > LIMITS.maxFrameSize) {
			return fail(`Frame size must be between ${LIMITS.minFrameSize} and ${LIMITS.maxFrameSize} pixels.`);
		}
		parsedFiles.push({ bytes, ...size });
	}

	const startPosition = current.reduce((max, f) => Math.max(max, f.position), -1) + 1;
	const added = parsedFiles.map((p, i) => ({
		id: crypto.randomUUID(),
		key: `frames/${campaign.id}/${crypto.randomUUID()}.png`,
		position: startPosition + i,
		...p,
	}));

	try {
		await Promise.all(
			added.map((f) => FRAMES.put(f.key, f.bytes, { httpMetadata: { contentType: "image/png" } })),
		);
		await DB.batch([
			DB.prepare("UPDATE campaigns SET title = ?, description = ?, caption = ?, visibility = ? WHERE id = ?").bind(
				title,
				description,
				caption,
				visibility,
				campaign.id,
			),
			...removing.map((f) => DB.prepare("DELETE FROM frames WHERE id = ?").bind(f.id)),
			...added.map((f) =>
				DB.prepare(
					"INSERT INTO frames (id, campaign_id, r2_key, width, height, position) VALUES (?, ?, ?, ?, ?, ?)",
				).bind(f.id, campaign.id, f.key, f.width, f.height, f.position),
			),
		]);
	} catch {
		await Promise.allSettled(added.map((f) => FRAMES.delete(f.key)));
		return fail("Failed to save changes. Please try again shortly.", 500);
	}

	if (removing.length > 0) await FRAMES.delete(removing.map((f) => f.r2_key)).catch(() => {});
	return Response.json({ ok: true });
}
