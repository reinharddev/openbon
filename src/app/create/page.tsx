import type { Metadata } from "next";
import CreateForm from "@/components/CreateForm";

export const metadata: Metadata = { title: "Create campaign" };

export default function CreatePage() {
	return (
		<div className="mx-auto flex max-w-xl flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Create campaign</h1>
				<p className="mt-1 text-muted">No account needed. You'll get a share link and an edit key.</p>
			</div>
			<CreateForm />
		</div>
	);
}
