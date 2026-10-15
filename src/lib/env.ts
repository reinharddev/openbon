import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getEnv() {
	return getCloudflareContext().env;
}
