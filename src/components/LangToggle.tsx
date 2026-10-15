"use client";

import { useRouter } from "next/navigation";
import { LOCALE_COOKIE } from "@/lib/i18n/dict";
import { useI18n } from "./I18nProvider";

/** Switches between English and Indonesian. The choice is stored in a cookie so the server can render it. */
export default function LangToggle({ className = "" }: { className?: string }) {
	const { locale, t } = useI18n();
	const router = useRouter();
	const next = locale === "en" ? "id" : "en";

	function onClick() {
		document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
		router.refresh();
	}

	return (
		<button type="button" onClick={onClick} className={`lang-btn ${className}`} aria-label={t("nav.langLabel")} title={t("nav.langLabel")}>
			<span data-on={locale === "en"}>EN</span>
			<span data-on={locale === "id"}>ID</span>
		</button>
	);
}
