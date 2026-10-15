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

	if (!title || title.length > LIMITS.maxTitle) return fail(`Judul wajib diisi (maks ${LIMITS.maxTitle} karakter).`);
	if (description.length > LIMITS.maxDescription) return fail(`Deskripsi maks ${LIMITS.maxDescription} karakter.`);
	if (files.length < 1 || files.length > LIMITS.maxFrames) return fail(`Unggah 1 sampai ${LIMITS.maxFrames} frame.`);
	if (requestedSlug && !isValidSlug(requestedSlug)) {
		return fail("Link hanya boleh huruf kecil, angka, dan tanda hubung (3-40 karakter).");
	}

	const parsed: { bytes: Uint8Array; width: number; height: number }[] = [];
	for (const file of files) {
		if (file.size > LIMITS.maxFrameBytes) return fail("Setiap frame maksimal 2 MB.");
		const bytes = new Uint8Array(await file.arrayBuffer());
		const size = readPngSize(bytes);
		if (!size) return fail("Frame harus berupa file PNG (dengan latar transparan).");
		const { width, height } = size;
		if (Math.min(width, height) < LIMITS.minFrameSize || Math.max(width, height) > LIMITS.maxFrameSize) {
			return fail(`Ukuran frame harus antara ${LIMITS.minFrameSize} dan ${LIMITS.maxFrameSize} piksel.`);
		}
		parsed.push({ bytes, width, height });
	}

	const { DB, FRAMES } = getEnv();

	let slug = requestedSlug;
	if (slug) {
		const taken = await DB.prepare("SELECT 1 FROM campaigns WHERE slug = ?").bind(slug).first();
		if (taken) return fail("Link itu sudah dipakai, coba yang lain.", 409);
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
		return fail("Gagal menyimpan kampanye. Coba lagi sebentar lagi.", 500);
	}

	return Response.json({ slug, editKey }, { status: 201 });
}
