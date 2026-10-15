import { randomKey, randomSlug, sha256Hex } from "@/lib/crypto";
import { getEnv } from "@/lib/env";
import { isValidSlug, LIMITS } from "@/lib/limits";
import { readPngSize } from "@/lib/png";

function fail(message: string, status = 400) {
	return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
	const form = await request.formData();
	const title = String(form.get("title") ?? "").trim();
	const description = String(form.get("description") ?? "").trim();
	const visibility = form.get("visibility") === "public" ? "public" : "unlisted";
	const requestedSlug = String(form.get("slug") ?? "").trim().toLowerCase();
	const files = form.getAll("frames").filter((f): f is File => typeof f !== "string");

	if (!title || title.length > LIMITS.maxTitle) return fail(`Title is required (max ${LIMITS.maxTitle} characters).`);
	if (description.length > LIMITS.maxDescription) return fail(`Description must be at most ${LIMITS.maxDescription} characters.`);
	if (files.length < 1 || files.length > LIMITS.maxFrames) return fail(`Upload 1 to ${LIMITS.maxFrames} frames.`);
	if (requestedSlug && !isValidSlug(requestedSlug)) {
		return fail("The link may only contain lowercase letters, numbers, and hyphens (3-40 characters).");
	}

	const parsed: { bytes: Uint8Array; width: number; height: number }[] = [];
	for (const file of files) {
		if (file.size > LIMITS.maxFrameBytes) return fail("Each frame must be 2 MB or smaller.");
		const bytes = new Uint8Array(await file.arrayBuffer());
		const size = readPngSize(bytes);
		if (!size) return fail("Frames must be PNG files (with a transparent background).");
		const { width, height } = size;
		if (Math.min(width, height) < LIMITS.minFrameSize || Math.max(width, height) > LIMITS.maxFrameSize) {
			return fail(`Frame size must be between ${LIMITS.minFrameSize} and ${LIMITS.maxFrameSize} pixels.`);
		}
		parsed.push({ bytes, width, height });
	}

	const { DB, FRAMES } = getEnv();

	let slug = requestedSlug;
	if (slug) {
		const taken = await DB.prepare("SELECT 1 FROM campaigns WHERE slug = ?").bind(slug).first();
		if (taken) return fail("That link is already taken, please try another.", 409);
	} else {
		slug = randomSlug();
	}

	const campaignId = crypto.randomUUID();
	const editKey = randomKey();
	const editKeyHash = await sha256Hex(editKey);
	const frameRows = parsed.map((p, index) => ({
		id: crypto.randomUUID(),
		key: `frames/${campaignId}/${crypto.randomUUID()}.png`,
		position: index,
		...p,
	}));

	try {
		await Promise.all(
			frameRows.map((f) =>
				FRAMES.put(f.key, f.bytes, { httpMetadata: { contentType: "image/png" } }),
			),
		);
		await DB.batch([
			DB.prepare(
				"INSERT INTO campaigns (id, slug, title, description, visibility, edit_key_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
			).bind(campaignId, slug, title, description, visibility, editKeyHash, Date.now()),
			...frameRows.map((f) =>
				DB.prepare(
					"INSERT INTO frames (id, campaign_id, r2_key, width, height, position) VALUES (?, ?, ?, ?, ?, ?)",
				).bind(f.id, campaignId, f.key, f.width, f.height, f.position),
			),
		]);
	} catch {
		await Promise.allSettled(frameRows.map((f) => FRAMES.delete(f.key)));
		return fail("Failed to save the campaign. Please try again shortly.", 500);
	}

	return Response.json({ slug, editKey }, { status: 201 });
}
