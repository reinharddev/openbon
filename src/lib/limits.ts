export const LIMITS = {
	maxFrames: 10,
	maxFrameBytes: 2 * 1024 * 1024,
	minFrameSize: 200,
	maxFrameSize: 2048,
	maxTitle: 80,
	maxDescription: 300,
	maxCaption: 1000,
	maxReason: 300,
	hideAfterReports: 5,
} as const;

const RESERVED_SLUGS = new Set(["create", "explore", "manage", "api", "c", "admin", "about", "static", "_next"]);

export function isValidSlug(slug: string): boolean {
	return /^[a-z0-9](?:[a-z0-9-]{1,38})[a-z0-9]$/.test(slug) && !RESERVED_SLUGS.has(slug);
}
