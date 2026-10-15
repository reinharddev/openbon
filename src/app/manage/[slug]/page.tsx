import type { Metadata } from "next";
import ManagePanel from "@/components/ManagePanel";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
	const { t } = await getT();
	return { title: t("manage.meta"), robots: { index: false } };
}

type Props = { params: Promise<{ slug: string }> };

export default async function ManagePage({ params }: Props) {
	const { slug } = await params;
	const { t } = await getT();
	return (
		<div className="mx-auto flex max-w-xl flex-col gap-6">
			<h1 className="text-3xl font-extrabold tracking-tight">{t("manage.meta")}</h1>
			<ManagePanel slug={slug} />
		</div>
	);
}
