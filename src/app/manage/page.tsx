import type { Metadata } from "next";
import ManageFinder from "@/components/ManageFinder";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
	const { t } = await getT();
	return { title: t("manage.meta"), robots: { index: false } };
}

export default async function ManageIndexPage() {
	const { t } = await getT();
	return (
		<div className="mx-auto flex max-w-xl flex-col gap-6">
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight">{t("manage.meta")}</h1>
				<p className="mt-2 text-muted">{t("manage.finderSub")}</p>
			</div>
			<ManageFinder />
		</div>
	);
}
