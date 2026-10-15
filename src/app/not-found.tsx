import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-start gap-4 py-10">
			<h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
			<p className="text-muted">This campaign may have been deleted or hidden, or the link is incorrect.</p>
			<Link href="/" className="rounded-md border border-border px-4 py-2 font-medium hover:bg-surface">
				Back to home
			</Link>
		</div>
	);
}
