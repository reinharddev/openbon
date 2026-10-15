import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "OpenBon",
		short_name: "OpenBon",
		description: SITE_DESCRIPTION,
		start_url: "/",
		display: "standalone",
		background_color: "#0e0e10",
		theme_color: "#c7f542",
		icons: [
			{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
			{ src: "/icon-512.png", sizes: "512x512", type: "image/png" },
			{ src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
		],
	};
}
