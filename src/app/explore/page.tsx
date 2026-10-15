import type { Metadata } from "next";
import Link from "next/link";
import { listPublicCampaigns } from "@/lib/campaigns";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Explore campaigns" };

const SHADOWS = ["card-lime", "card-pink", "card-violet"] as const;

export default async function ExplorePage() {
	const campaigns = await listPublicCampaigns();

	return (
		<div className="flex flex-col gap-8">
			<div>
				<h1 className="text-3xl font-extrabold tracking-tight">
					Public <span className="mark">campaigns</span>
				</h1>
				<p className="mt-2 text-muted">The latest frames people shared with the world.</p>
			</div>

			{campaigns.length === 0 ? (
				<p className="card card-ink p-8 text-center text-muted">
					No public campaigns yet.{" "}
					<Link href="/create" className="font-bold text-accent-ink underline">
						Be the first.
					</Link>
				</p>
			) : (
				<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
					{campaigns.map((c, i) => (
						<li key={c.id}>
							<Link href={`/c/${c.slug}`} className={`card ${SHADOWS[i % SHADOWS.length]} block overflow-hidden`}>
								<div className="checker aspect-square border-b-2 border-border">
									{c.cover_frame_id ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={`/api/frames/${c.cover_frame_id}`}
											alt=""
											loading="lazy"
											className="h-full w-full object-contain"
										/>
									) : null}
								</div>
								<div className="p-3">
									<p className="truncate font-extrabold">{c.title}</p>
									<p className="text-xs text-muted">{c.uses.toLocaleString("en-US")} uses</p>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
