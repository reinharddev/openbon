import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Send plain HTTP to HTTPS even if the Cloudflare "Always Use HTTPS" setting is off.
	async redirects() {
		return [
			{
				source: "/:path*",
				has: [{ type: "header", key: "x-forwarded-proto", value: "http" }],
				destination: "https://openbon.my.id/:path*",
				permanent: true,
			},
		];
	},
	// Lets phones on the same Wi-Fi load dev JS (otherwise the page never hydrates).
	allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*", "*.local", "varying-favored-riverside.ngrok-free.dev"],
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
