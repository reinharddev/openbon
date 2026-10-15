import { getEnv } from "@/lib/env";

type Ctx = { params: Promise<{ slug: string }> };

/** Anonymous usage counter: increments one integer, stores nothing about the visitor. */
export async function POST(_request: Request, { params }: Ctx) {
	const { slug } = await params;
	const { DB } = getEnv();
	await DB.prepare("UPDATE campaigns SET uses = uses + 1 WHERE slug = ? AND hidden = 0").bind(slug).run();
	return new Response(null, { status: 204 });
}
