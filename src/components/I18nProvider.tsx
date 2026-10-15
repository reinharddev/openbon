"use client";

import { createContext, useContext, useMemo } from "react";
import { makeT, type Locale, type Translate } from "@/lib/i18n/dict";

type Ctx = { locale: Locale; t: Translate };
const I18nContext = createContext<Ctx>({ locale: "en", t: makeT("en") });

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
	const value = useMemo(() => ({ locale, t: makeT(locale) }), [locale]);
	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	return useContext(I18nContext);
}
