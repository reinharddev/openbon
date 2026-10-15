import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-start gap-4 py-10">
			<span className="chip chip-pink -rotate-3">404</span>
			<h1 className="text-3xl font-extrabold tracking-tight">Whoops, nothing here.</h1>
			<p className="text-muted">This campaign may have been deleted or hidden, or the link is a little off.</p>
			<Link href="/" className="btn btn-lime">
				Back to home
			</Link>
		</div>
	);
}
