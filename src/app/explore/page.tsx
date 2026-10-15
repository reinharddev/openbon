import type { Metadata } from "next";
import Link from "next/link";
import { listPublicCampaigns } from "@/lib/campaigns";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Explore campaigns" };

export default async function ExplorePage() {
	const campaigns = await listPublicCampaigns();

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Public campaigns</h1>
				<p className="mt-1 text-muted">The latest campaigns created with public visibility.</p>
			</div>

			{campaigns.length === 0 ? (
				<p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">
					No public campaigns yet.{" "}
					<Link href="/create" className="text-accent underline">
						Be the first.
					</Link>
				</p>
			) : (
				<ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{campaigns.map((c) => (
						<li key={c.id}>
							<Link
								href={`/c/${c.slug}`}
								className="block overflow-hidden rounded-lg border border-border bg-surface hover:border-accent"
							>
								<div className="checker aspect-square">
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
									<p className="truncate font-medium">{c.title}</p>
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
