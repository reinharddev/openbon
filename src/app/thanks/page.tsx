import type { Metadata } from "next";
import Sticker from "@/components/Sticker";
import { supporters } from "@/content/supporters";

export const metadata: Metadata = { title: "Special thanks" };

const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL;
const SHADOWS = ["card-lime", "card-pink", "card-violet"] as const;

export default function ThanksPage() {
	const list = [...supporters].reverse();

	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-8">
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight">
					Special <span className="mark">thanks</span>
				</h1>
				<p className="mt-2 text-muted">
					OpenBon is free, with no ads and no watermark. These people help keep it running. Supporter names may be
					listed here.
				</p>
			</div>

			{list.length === 0 ? (
				<div className="card card-ink flex flex-col items-center p-8 text-center">
					<Sticker name="heart" tilt={-7} className="sticker-in mb-3 w-20" />
					<p className="text-muted">No supporters listed yet. You could be the first.</p>
					{donateUrl ? (
						<a href={donateUrl} target="_blank" rel="noopener noreferrer" className="btn btn-lime mt-4">
							Support OpenBon
						</a>
					) : null}
				</div>
			) : (
				<ul className="grid gap-5 sm:grid-cols-2">
					{list.map((s, i) => (
						<li
							key={`${s.name}-${s.date ?? ""}`}
							className={`card ${SHADOWS[i % SHADOWS.length]} flex items-center justify-between gap-3 px-4 py-3`}
						>
							<span className="truncate font-extrabold">{s.name}</span>
							{s.date ? <span className="shrink-0 text-xs text-muted">{s.date}</span> : null}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
