/** Placeholders look like [Name]: square brackets, 1-40 characters, no nesting or line breaks. */
export const PLACEHOLDER_RE = /\[([^\[\]\n]{1,40})\]/g;

export type CaptionPart = { text: string; key: string | null };

export function splitCaption(template: string): CaptionPart[] {
	const parts: CaptionPart[] = [];
	let last = 0;
	for (const m of template.matchAll(PLACEHOLDER_RE)) {
		const key = m[1].trim();
		if (!key) continue;
		if (m.index > last) parts.push({ text: template.slice(last, m.index), key: null });
		parts.push({ text: m[0], key });
		last = m.index + m[0].length;
	}
	if (last < template.length) parts.push({ text: template.slice(last), key: null });
	return parts;
}

export function placeholderKeys(template: string): string[] {
	const seen = new Set<string>();
	for (const p of splitCaption(template)) if (p.key) seen.add(p.key);
	return [...seen];
}

export function fillCaption(template: string, values: Record<string, string>): string {
	return splitCaption(template)
		.map((p) => (p.key && values[p.key]?.trim() ? values[p.key].trim() : p.text))
		.join("");
}
