import { sha256Hex, timingSafeEqual } from "./crypto";
import { getEnv } from "./env";

export type OwnedCampaign = {
	id: string;
	slug: string;
	title: string;
	description: string;
	caption: string;
	visibility: "public" | "unlisted";
	uses: number;
};

/** Returns the campaign when `key` is its edit key, otherwise null. */
export async function findOwned(slug: string, key: string): Promise<OwnedCampaign | null> {
	if (!key) return null;
	const { DB } = getEnv();
	const row = await DB.prepare(
		"SELECT id, slug, title, description, caption, visibility, uses, edit_key_hash FROM campaigns WHERE slug = ?",
	)
		.bind(slug)
		.first<OwnedCampaign & { edit_key_hash: string }>();
	if (!row) return null;
	const hash = await sha256Hex(key);
	if (!timingSafeEqual(hash, row.edit_key_hash)) return null;
	const { edit_key_hash: _drop, ...campaign } = row;
	void _drop;
	return campaign;
}
