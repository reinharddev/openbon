import type { Metadata } from "next";
import ManagePanel from "@/components/ManagePanel";

export const metadata: Metadata = { title: "Kelola kampanye", robots: { index: false } };

type Props = { params: Promise<{ slug: string }> };

export default async function ManagePage({ params }: Props) {
	const { slug } = await params;
	return (
		<div className="mx-auto flex max-w-xl flex-col gap-6">
			<h1 className="text-2xl font-semibold tracking-tight">Kelola kampanye</h1>
			<ManagePanel slug={slug} />
		</div>
	);
}
