import type { Metadata } from "next";
import CreateForm from "@/components/CreateForm";

export const metadata: Metadata = { title: "Buat kampanye" };

export default function CreatePage() {
	return (
		<div className="mx-auto flex max-w-xl flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Buat kampanye</h1>
				<p className="mt-1 text-muted">Tidak perlu akun. Kamu akan mendapat link bagikan dan kunci edit.</p>
			</div>
			<CreateForm />
		</div>
	);
}
