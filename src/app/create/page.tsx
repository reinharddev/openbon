import type { Metadata } from "next";
import CreateForm from "@/components/CreateForm";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
	const { t } = await getT();
	return { title: t("create.meta"), description: t("create.metaDesc"), alternates: { canonical: "/create" } };
}

export default async function CreatePage() {
	const { t } = await getT();
	return (
		<div className="mx-auto flex max-w-xl flex-col gap-6">
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight">
					{t("create.title", { mark: "" })}
					<span className="mark">{t("create.mark")}</span>
				</h1>
				<p className="mt-2 text-muted">{t("create.sub")}</p>
			</div>
			<CreateForm />
		</div>
	);
}
