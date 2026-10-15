/** Public origin of the site. Override with NEXT_PUBLIC_SITE_URL (e.g. for a staging domain). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://openbon.my.id").replace(/\/+$/, "");

export const SITE_NAME = "OpenBon";
export const SITE_DESCRIPTION =
	"Make a photo frame, share one link, and let anyone drop their pic in. Free and open source: no watermark, no ads, no tracking.";

/** Where abuse reports, takedown requests, and general questions go. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "reinhard.dave08@gmail.com";
