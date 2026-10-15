import Link from "next/link";
import Sticker from "@/components/Sticker";

export default function NotFound() {
	return (
		<div className="flex flex-col items-start gap-4 py-10">
			<div className="flex items-center gap-3">
				<span className="chip chip-pink -rotate-3">404</span>
				<Sticker name="sad" tilt={-8} className="sticker-in w-16" />
			</div>
			<h1 className="text-3xl font-extrabold tracking-tight">Whoops, nothing here.</h1>
			<p className="text-muted">This campaign may have been deleted or hidden, or the link is a little off.</p>
			<Link href="/" className="btn btn-lime">
				Back to home
			</Link>
		</div>
	);
}
