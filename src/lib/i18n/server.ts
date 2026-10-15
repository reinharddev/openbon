import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, LOCALES, makeT, type Locale } from "./dict";

export async function getLocale(): Promise<Locale> {
	const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
	if (saved && (LOCALES as readonly string[]).includes(saved)) return saved as Locale;
	const accept = (await headers()).get("accept-language") ?? "";
	const first = accept.split(",")[0]?.trim().toLowerCase() ?? "";
	return first.startsWith("id") || first.startsWith("in") ? "id" : "en";
}

export async function getT() {
	const locale = await getLocale();
	return { locale, t: makeT(locale) };
}
