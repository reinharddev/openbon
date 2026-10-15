"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ManagePanel({ slug }: { slug: string }) {
	const [key, setKey] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [deleted, setDeleted] = useState(false);

	useEffect(() => {
		try {
			const saved = localStorage.getItem(`openbon:key:${slug}`);
			if (saved) setKey(saved);
		} catch {}
	}, [slug]);

	async function onDelete() {
		if (!window.confirm("Delete this campaign permanently? Its link will stop working.")) return;
		setBusy(true);
		setError(null);
		try {
			const res = await fetch(`/api/campaigns/${slug}`, { method: "DELETE", headers: { "x-edit-key": key } });
			if (!res.ok) {
				const data = (await res.json().catch(() => ({}))) as { error?: string };
				setError(data.error ?? "Failed to delete the campaign.");
				return;
			}
			try {
				localStorage.removeItem(`openbon:key:${slug}`);
			} catch {}
			setDeleted(true);
		} catch {
			setError("Could not reach the server.");
		} finally {
			setBusy(false);
		}
	}

	if (deleted) {
		return (
			<div className="flex flex-col items-start gap-3">
				<p>Campaign deleted.</p>
				<Link href="/" className="rounded-md border border-border px-4 py-2 font-medium hover:bg-surface">
					Back to home
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-5">
			<div>
				<Link href={`/c/${slug}`} className="text-accent underline">
					/c/{slug}
				</Link>
			</div>

			<div>
				<label htmlFor="key" className="mb-1 block text-sm font-medium">
					Edit key
				</label>
				<input
					id="key"
					value={key}
					onChange={(e) => setKey(e.target.value)}
					className="w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm"
					placeholder="Paste your edit key here"
				/>
			</div>

			{error ? <p className="text-sm text-danger">{error}</p> : null}

			<div>
				<button
					type="button"
					onClick={onDelete}
					disabled={!key || busy}
					className="rounded-md bg-danger px-4 py-2 font-medium text-white disabled:opacity-50"
				>
					Delete campaign
				</button>
			</div>
		</div>
	);
}
