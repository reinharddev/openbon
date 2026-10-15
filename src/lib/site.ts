/** Public origin of the site. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://openbon.my.id). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const SITE_NAME = "OpenBon";
export const SITE_DESCRIPTION =
	"Make a photo frame, share one link, and let anyone drop their pic in. Free and open source: no watermark, no ads, no tracking.";
