import type { Metadata } from "next";
import CreateForm from "@/components/CreateForm";

export const metadata: Metadata = {
	title: "Make a frame",
	description: "Upload a transparent PNG, get one share link. No account, no watermark, up to 10 frames per campaign.",
	alternates: { canonical: "/create" },
};

export default function CreatePage() {
	return (
		<div className="mx-auto flex max-w-xl flex-col gap-6">
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight">
					Make a <span className="mark">frame</span>
				</h1>
				<p className="mt-2 text-muted">No account needed. You'll get a share link and an edit key.</p>
			</div>
			<CreateForm />
		</div>
	);
}
