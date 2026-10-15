import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { terms as docs } from "@/content/legal";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
	const { locale } = await getT();
	const doc = docs[locale];
	return { title: doc.title, description: doc.intro, alternates: { canonical: "/terms" } };
}

export default async function Page() {
	const { locale } = await getT();
	return <LegalPage doc={docs[locale]} />;
}
